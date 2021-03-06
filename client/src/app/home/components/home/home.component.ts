import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  faArrowDownWideShort,
  faCircleArrowUp,
  faCircleArrowDown,
  faCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';
import { TransactionDialogComponent } from 'src/app/transaction/components/transaction-dialog/transaction-dialog.component';
import { TransactionService } from 'src/app/transaction/service/transaction.service';
import { TransactionInterface } from 'src/app/transaction/types/transaction.interface';
import { TransactionDetailComponent } from '../dialog/transaction-detail.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  faArrowDownWideShort = faArrowDownWideShort;
  faCircleArrowUp = faCircleArrowUp;
  faCircleArrowDown = faCircleArrowDown;
  faCirclePlus = faCirclePlus;

  accountTransactions!: TransactionInterface[];
  tempAccountTransactions!: TransactionInterface[];
  accountTransactionsSubscription!: Subscription;
  activeAccountSubscription!: Subscription;
  filterState: string = 'all';
  dateSort: string = 'decrease';
  currency!: string;
  noActiveAccount: boolean = false;

  search = new FormControl();

  constructor(
    private dialog: MatDialog,
    private transactionService: TransactionService,
    private accountService: AccountService
  ) {
    this.getInitialData();
    this.watchSearch();
  }

  expenseFilterTransactions(): void {
    this.filterState = 'expense';
    this.accountTransactions = this.tempAccountTransactions.filter(
      (transaction) => transaction.type === 'expense'
    );
    if (this.dateSort === 'increase') {
      this.increaseDateSort();
    } else if (this.dateSort === 'decrease') {
      this.decreaseDateSort();
    }
  }

  incomeFilterTransactions(): void {
    this.filterState = 'income';
    this.accountTransactions = this.tempAccountTransactions.filter(
      (transaction) => transaction.type === 'income'
    );
    if (this.dateSort === 'increase') {
      this.increaseDateSort();
    } else if (this.dateSort === 'decrease') {
      this.decreaseDateSort();
    }
  }

  reset(): void {
    this.filterState = 'all';
    this.accountTransactions = this.tempAccountTransactions;
  }

  increaseDateSort(): void {
    this.dateSort = 'increase';
    this.accountTransactions = this.accountTransactions.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  watchSearch() {
    this.search.valueChanges.subscribe((value) => {
      if (value) {
        this.accountTransactions = this.tempAccountTransactions.filter(
          (transaction) =>
            transaction.title.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.reset();
      }
    });
  }

  decreaseDateSort(): void {
    this.dateSort = 'decrease';
    this.accountTransactions = this.accountTransactions.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(TransactionDialogComponent, {
      height: '520px',
      width: '600px',
    });
  }

  getInitialData(): void {
    this.activeAccountSubscription = this.accountService
      .getActiveAccount()
      .subscribe((account) => {
        if (account?._id) {
          this.noActiveAccount = false;
          this.currency = account.currency;
          this.accountTransactionsSubscription = this.transactionService
            .requestAccountTransactions(account._id)
            .subscribe((data) => {
              this.accountTransactions = data.transactions;
              this.tempAccountTransactions = data.transactions;
              if (this.filterState === 'all') {
                this.reset();
              } else if (this.filterState === 'income') {
                this.incomeFilterTransactions();
              } else if (this.filterState === 'expense') {
                this.expenseFilterTransactions();
              }
              if (this.dateSort === 'increase') {
                this.increaseDateSort();
              } else if (this.dateSort === 'decrease') {
                this.decreaseDateSort();
              }
            });
        } else {
          this.noActiveAccount = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.accountTransactionsSubscription?.unsubscribe();
    this.activeAccountSubscription?.unsubscribe();
  }

  transactionDetails(transaction: TransactionInterface): void {
    this.dialog.open(TransactionDetailComponent, {
      height: '520px',
      width: '600px',
      data: { transaction, currency: this.currency },
    });
  }
}
