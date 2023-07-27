from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-watched_stocks', '-owned_stocks', '-created_at', '-updated_at')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    _password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    watched_stocks = db.relationship('WatchedStock', backref='user')
    owned_stocks = db.relationship('OwnedStock', backref='user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'), 10)
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<User {self.username}>'
    
class Stock(db.Model, SerializerMixin):
    __tablename__ = 'stocks'

    serialize_rules = ('-watched_stocks', '-owned_stocks', '-transactions', '-created_at', '-updated_at')

    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String)
    company_name = db.Column(db.String)
    price = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    watched_stocks = db.relationship('WatchedStock', backref='stock')
    transactions = db.relationship('Transaction', backref='stock')
    owned_stocks = db.relationship('OwnedStock', backref='stock')

    def __repr__(self):
        return f'<{self.company_name} ticker: {self.ticker}>'

class WatchedStock(db.Model, SerializerMixin):
    __tablename__ = 'watched_stocks'

    serialize_rules = ('-user', '-stock', '-created_at', '-updated_at')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __repr__(self):
        return f'<{self.user.username} is watching {self.stock.company_name}>'

class OwnedStock(db.Model, SerializerMixin):
    __tablename__ = 'owned_stocks'

    serialize_rules = ('-user', '-stock', '-created_at', '-updated_at')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.id'))
    quantity = db.Column(db.Float)
    total_cost = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __repr__(self):
        return f'<{self.user.name} owns shares of {self.stock.company_name}>'
    
class Transaction(db.Model, SerializerMixin):
    __tablename__ = "transactions"

    serialize_rules = ('-created_at', '-updated_at', '-stocks')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.id'))
    quantity = db.Column(db.Float)
    share_price = db.Column(db.Float)
    bought_total = db.Column(db.Integer)
    sold_total = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __repr__(self):
        return f'<purchased {self.qantity} share of {self.stock.name}>'