"""
Created on Sep 21, 2015

@author: hans wang
"""
from RestCall import RestCaller
import urllib2
import urllib
import json
import argparse
import time
# import json

clientid = "dj0yJmk9MW9ybDhrZUd0MkdUJmQ9WVdrOWJuWktZVXd4TXpBbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kNQ--"
clientSecret = "32a2b5f6cffb894566efd3ec7eb61871fd7a22c8"
indexes_list = None
mean_server_url = "http://localhost:3000/api/demo/quotes"
rest_caller = None


def parse_arguments():
    """
    Parse the command line arguement.
    :return:
    """
    parser = argparse.ArgumentParser(description='Commodity Index Crawler')
    parser.add_argument('-start', dest='startdate', metavar='startdate', type=str, help='start date of the commodity')
    parser.add_argument('-end', dest='enddate', metavar='enddate', type=str, help='end date of the commodity')
    parser.add_argument('-daily', dest='daily', action='store_true', help='check commodity every day')
    parser.add_argument('-index', dest='index', metavar='index', type=str, help='index symbol')
    return parser.parse_args()


def print_how_to():
    """
    Print the usage instruction
    :return:
    """
    print "usage 1: -start -end -index"
    print "usage 2: -daily -index"
    print "-start : start date for retrieving historical indexes from"
    print "-end : end date for retrieving historical indexes"
    print "-daily : if scripts has to routinely running and check given index everyday."
    print "-index : the index to lookup, the symbol of the index on Yahoo. i.e. Dow Jones Index => ^DJI"
    print "-index support multiple index symbol inputs by separating by ','"
    print "i.e. YHOO,^DJI,BBRY  for yahoo, don jones, and blackberry"


def daily_process():
    """
    For daily routinely chekcing the server for new data.
    Store it to mongo db
    :return:
    """
    global indexes_list
    global rest_caller
    rest_caller = RestCaller(mean_server_url)
    while True:
        try:
            for index in indexes_list:
                raw_quote_list = yql_query(index)
                converted_list = convert_to_Infusion_JSON_list(raw_quote_list)
                for item in converted_list:
                    rest_caller.post(item)
            print "Waiting for next checking period (1hour interval)..."
            time.sleep(3600)
        except Exception:
            print "Network is not stable... retry in next iteration"
            pass


def historical_data_process(start, end):
    """
    For reqeusting historical index data from yahoo server.
    store to mongo db.
    :param start: start date
    :param end: end date
    :return:
    """
    global indexes_list
    global rest_caller
    rest_caller = RestCaller(mean_server_url)
    for index in indexes_list:
        raw_quote_list = yql_query(index, start, end)
        converted_list = convert_to_Infusion_JSON_list(raw_quote_list)
        for item in converted_list:
            rest_caller.post(item)


def convert_to_Infusion_JSON_list(raw_quotes):
    """
    Convert JSON list from yahoo into our mean server's json format.
    :param raw_quotes:
    :return:
    """
    converted_list = []
    print raw_quotes
    if raw_quotes is not None:
        if isinstance(raw_quotes, list):
            for q in raw_quotes:
                converted_list.append(json_yahoo_to_Infusion(q))
        else:
            converted_list.append(json_yahoo_to_Infusion(raw_quotes))
    return converted_list


def json_yahoo_to_Infusion(quote):
    """
    Convert JSON object into our JSON format from yahoo server.
    :param quote:
    :return: Formatted JSON.
    """
    # date time string is in different format
    # has to parse it separately
    #timetext = quote['Date']
    #parsed_date = time.strptime(timetext, "%a %b %d %Y %H:%M:%S "+timetext[-14:])
    #datestr_for_infusion = time.strftime("%Y-%m-%d", parsed_date)
    data = {
        "qsymbol":urllib.unquote(quote['Symbol']),
        "qdate":quote['Date'],
        "open":quote['Open'],
        "high":quote['High'],
        "low":quote['Low'],
        "close":quote['Close'],
        "volume":quote['Volume'],
        "adj_close":quote['Adj_Close']
    }
    return data


def yql_query(symbol, start=time.strftime("%Y-%m-%d"), end=time.strftime("%Y-%m-%d")):
    """
    Executing yql request (Rest call)
    :param symbol: The index symbol
    :param start: start date
    :param end: end date
    :return: JSON data from yahoo server.
    """
    baseurl = "https://query.yahooapis.com/v1/public/yql?"
    yql_query = 'SELECT * FROM yahoo.finance.historicaldata WHERE symbol="'+symbol+'" and startDate="'+start+'" and endDate="'+end+'"'
    yql_url = baseurl + urllib.urlencode({'q':yql_query}) + "&format=json&env=http://datatables.org/alltables.env"
    print yql_url
    result = urllib2.urlopen(yql_url).read()
    data = json.loads(result)
    print data['query']['results']
    if data['query']['results'] is None:
        return None
    else:
        return data['query']['results']['quote']


def init():
    global indexes_list
    global rest_caller
    args = parse_arguments()
    if args.index is None:
        print_how_to()
        quit()
    if(args.daily is False) and (args.startdate is not None and args.enddate is not None):
        rest_caller = RestCaller(mean_server_url)
        indexes_list = args.index.split(',')
        historical_data_process(args.startdate, args.enddate)
    elif args.daily is True and (args.startdate is None and args.enddate is None):
        rest_caller = RestCaller(mean_server_url)
        indexes_list = args.index.split(',')
        daily_process()
    else:
        print_how_to()
        quit()


def main():
    global indexes_list
    init()

if __name__ == '__main__':
    main()
