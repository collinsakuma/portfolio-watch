from flask import request, session, make_response, render_template
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import *
from models import User, Stock, WatchedStock, OwnedStock, Transaction

@app.route('/')
@app.route('/<int:id>')
def index(id=0):
    return render_template("index.html")

class Signup(Resource):

    def post(self):
        request_json = request.get_json()
        username = request_json.get('username')
        password = request_json.get('password')

        user = User(
            username=username
        )

        user.password_hash = password

        try:
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return make_response(user.to_dict(), 201)
        except IntegrityError:
            return make_response({"error":"422 Unprocessable Entity"}, 422)
        
api.add_resource(Signup, '/signup')

class CheckSession(Resource):
    def get(self):
        try:
            user = User.query.filter_by(id=session['user_id']).first()
            return make_response(user.to_dict(), 200)
        except:
            return make_response({"error": "Unauthorized"}, 401)
        
api.add_resource(CheckSession, '/check_session')


class Login(Resource):
    def post(self):
        request_json = request.get_json()
        username = request_json['username']
        password = request_json['password']
        user = User.query.filter(User.username == username).first()
        if user:
            if user.authenticate(password):
                session['user_id'] = user.id
                return make_response(user.to_dict(), 200)
        return make_response({"error": "401 Unauthorized"}, 401)
api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session['user_id'] = None
            return make_response({"message": "Logout Sucessful"}, 204)
        return make_response({"error": "401 Unauthorized"}, 401)

api.add_resource(Logout, '/logout')

class Stocks(Resource):
    def get(self):
        stocks = [stock.to_dict() for stock in Stock.query.all()]
        return make_response(stocks, 200)
    
    def post(self):
        request_json = request.get_json()
        if not request_json:
            return make_response({"Error":"invalid stock"}, 404)
        # check if stock already exist in Stock table
        elif request_json['ticker'] in [stock.ticker for stock in Stock.query.all()]:
            return make_response({"Error":"Stock already exist"},400)
        else:
            stock = Stock(
                ticker = request_json['ticker'],
                company_name = request_json['company_name'],
                price = request_json['price']
            )
            db.session.add(stock)
            db.session.commit()
            
            return make_response(stock.to_dict(), 201)
api.add_resource(Stocks, '/stocks')

class StocksById(Resource):
    def get(self, id):
        stock = Stock.query.filter_by(id=id).first()
        if not stock:
            return make_response({"error": "stock no found"},404)
        else: 
            return make_response(stock.to_dict(), 200)
api.add_resource(StocksById, '/stocks/<int:id>')

class WatchedStocks(Resource):
    
    def post(self):
        request_json = request.get_json()
        if not request_json:
            return make_response({"Error": "invalid request"}, 404)
        elif request_json['stock_id'] in [stock.stock_id for stock in WatchedStock.query.filter_by(user_id = session['user_id']).all()]:
            return make_response({"Error":"Stock is already is users watchlist"},400)
        # note add so a user cant add the same stock twice to their watchedStocks
        else:
            newWatchedStock = WatchedStock(
                user_id = request_json['user_id'],
                stock_id = request_json['stock_id'],
            )
            db.session.add(newWatchedStock)
            db.session.commit()
            return make_response(newWatchedStock.to_dict(),201)
api.add_resource(WatchedStocks, '/watched_stocks')

class WatchedStocksById(Resource):
    def delete(self, id):
        watchedStock = WatchedStock.query.filter_by(id=id).first()
        if not watchedStock:
            return make_response({"error": "stock not found"}, 404)
        else:
            db.session.delete(watchedStock)
            db.session.commit()
api.add_resource(WatchedStocksById, '/watched_stocks/<int:id>')


class WatchedStocksByUser(Resource):
    def get(self):
        watchedStocks = [stock.to_dict(rules=('stock',)) for stock in WatchedStock.query.filter_by(user_id = session['user_id'])]
        return make_response(watchedStocks, 200)
api.add_resource(WatchedStocksByUser, '/watched_stocks_by_user')

class OwnedStocks(Resource):
    def get(self):
        owned_stocks = [stock.to_dict() for stock in OwnedStock.query.all()]
        return make_response(owned_stocks, 200)
    
    def post(self):
        request_json = request.get_json()
        if not request_json:
            return make_response({"Error": "invalid request"},404)
        else:
            new_owned_stock = OwnedStock(
                user_id = request_json['user_id'],
                stock_id = request_json['stock_id'],
                quantity = request_json['quantity'],
                total_cost = request_json['total_cost']
            )
            db.session.add(new_owned_stock)
            db.session.commit()

            return make_response(new_owned_stock.to_dict(), 201)
api.add_resource(OwnedStocks, '/owned_stocks')

# OwnedStockById returns a stock by its id and checks if the current user already has this stock in OwnedStocks
class OwnedStocksById(Resource):
    def patch(self, id):
        stock = OwnedStock.query.filter_by(id=id).filter_by(user_id=session['user_id']).first()
        if not stock:
            return make_response({"error": "user not found"}, 404)
        request_json = request.get_json()
        for attr in request_json:
            setattr(stock, attr, request_json[attr])
        db.session.add(stock)
        db.session.commit()

        return make_response(stock.to_dict(), 202)
    
    def delete(self, id):
        stock = OwnedStock.query.filter_by(id=id).filter_by(user_id=session['user_id']).first()
        if not stock:
            return make_response({"Error": "Stock not found"}, 404)
        db.session.delete(stock)
        db.session.commit()

api.add_resource(OwnedStocksById, '/owned_stocks/<int:id>')

class StocksByUserId(Resource):
    def get(self):
        stocks = [stock.to_dict(rules=('stock',)) for stock in OwnedStock.query.filter_by(user_id=session['user_id'])]
        return make_response(stocks, 200)
api.add_resource(StocksByUserId, '/stocks_by_user_id')

class Transactions(Resource):
    def get(self):
        transactions = [transaction.to_dict() for transaction in Transaction.query.all()]
        return make_response(transactions, 200)
    
    def post(self):
        request_json = request.get_json()
        if not request_json:
            return make_response({"Error": "invalid request"},404)
        else:
            new_transaction = Transaction(
                user_id = request_json['user_id'],
                stock_id = request_json['stock_id'],
                quantity = request_json['quantity'],
                bought_total = request_json['bought_total'],
                sold_total = request_json['sold_total'],
                share_price = request_json['share_price']
            )
            db.session.add(new_transaction)
            db.session.commit()
            return make_response(new_transaction.to_dict(), 201)

api.add_resource(Transactions, '/transactions')

class TransactionsByUserId(Resource):
    def get(self):
        transactions = [transaction.to_dict(rules=('stock', 'created_at')) for transaction in Transaction.query.filter_by(user_id=session['user_id'])]
        return make_response(transactions, 200)
api.add_resource(TransactionsByUserId, '/transactions_by_user_id')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
