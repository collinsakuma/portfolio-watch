#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
# from faker import Faker

# Local imports
from app import app
from models import db, User, Stock, WatchedStock, OwnedStock, Transaction

if __name__ == '__main__':
    # fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        User.query.delete()
        Stock.query.delete()
        WatchedStock.query.delete()
        OwnedStock.query.delete()
        Transaction.query.delete()

        user_1 = User(
        username="Collin",
        )
        user_1.password_hash = "collinsakuma"

        user_2 = User(
        username="user",
        )
        user_2.password_hash = "password"

        user_3 = User(
        username="demo",
        )
        user_3.password_hash = "password"

        stock1 = Stock(
            ticker="aapl",
            company_name="Apple",
            price=100
        )

        stock2 = Stock(
            ticker="msft",
            company_name="Microsoft Corp",
            price=101
        )

        stock3 = Stock(
            ticker="amd",
            company_name="Advanced Micro Devices",
            price=102
        )


        db.session.add_all([user_1, user_2, user_3, stock1, stock2, stock3])
        db.session.commit()