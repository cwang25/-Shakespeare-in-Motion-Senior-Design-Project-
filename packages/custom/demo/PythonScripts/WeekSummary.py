"""
Created on Oct 26, 2015

@author: hans wang
"""
from RestCall import RestCaller
import RestCall
import urllib2
import urllib
import json
import argparse
import time

article_url = "http://localhost:3000/api/demo/newsarticles"
quote_url = "http://localhost:3000/api/demo/quotes"
week_sum_url = "http://localhost:3000/api/demo/weekSum"

#
# class WeekSum:
#     def __init__(self):
#         pass
def parse_arguments():
    """
    Parse the command line arguement.
    :return:
    """
    parser = argparse.ArgumentParser(description='Week summary')
    parser.add_argument('-start', dest='startdate', metavar='startdate', type=str, help='start date of the commodity')
    parser.add_argument('-end', dest='enddate', metavar='enddate', type=str, help='end date of the commodity')
    parser.add_argument('-index', dest='index', metavar='index', type=str, help='the symbol that weeksum is based on')
    return parser.parse_args()


def print_how_to():
    """
    Print the usage instruction
    :return:
    """
    print "usage : -start -end"
    print "-start : start date"
    print "-end : end date"
    print "-index : index symbol of quote to retrieve"


def get_article_list_by_date_range(startdate, enddate):
    articles = RestCall.send_raw_request("get", "http://localhost:3000/api/demo/newsbydaterange?startdate=" + startdate + "&enddate=" + enddate).json()
    return articles


def get_all_article_list():
    articles = RestCall.send_raw_request("get", "http://localhost:3000/api/demo/newsarticles").json()
    return articles


def get_week_summaries(date):
    week_sum = RestCall.send_raw_request("get",
                                         "http://localhost:3000/api/demo/weeksum_by_date?date=" + date).json()
    return week_sum


def get_quotes_list(startdate, enddate, quote):
    quote_rest = RestCall.send_raw_request("get", "http://localhost:3000/api/demo/quotes_by_date_range?startdate=" + startdate + "&enddate=" + enddate + "&indexsymbol="+quote)
    quotes = quote_rest.json()
    return quotes


def get_all_quotes_list():
    quote_rest = RestCall.send_raw_request("get", "http://localhost:3000/api/demo/quotes_by_symbol?indexsymbol=^DJC")
    quotes = quote_rest.json()
    return quotes


def generate_summary(articles, quotes, quote):
    summary = {
        "week_start_date":None,
        "week_end_date":None,
        "week_index":quote,
        "bcom_indices":None,
        "bcom_max":None,
        "bcom_min":None,
        "bcom_avg_slope":None,
        "bcom_week_momentum":None,
        "bcom_week_rsi":None,
        "articles":None,
        "avg_articles_sentiment":None
    }
    #for q in quotes:
    #    print q["qdate"]
    first_q = quotes[-1]
    last_q = quotes[0]
    summary["week_start_date"] = first_q["qdate"]
    summary["week_end_date"] = last_q["qdate"]
    #quote summary
    q_id_list = []
    q_max = -1.0
    q_min = 999999999999.9
    total_diff = 0.0
    for i, quote in enumerate(quotes):
        if i == 0:
            q_max = float(quote["close"])
            q_min = float(quote["close"])
        if quote["close"] > q_max: q_max = float(quote["close"])
        if quote["close"] < q_min: q_min = float(quote["close"])
        if i > 0:
            total_diff += float(quotes[i]["close"]) - float(quotes[i-1]["close"])
        q_id_list.append(quote["_id"])
    if len(quotes)-1 > 0:
        total_diff /= (len(quotes)-1)
    summary["bcom_indices"] = q_id_list
    summary["bcom_max"] = json.dumps(q_max)
    summary["bcom_min"] = json.dumps(q_min)
    summary["bcom_avg_slope"] = json.dumps(total_diff)
    #calcualte RSI
    AU = 0
    AD = 0
    for i in range(1, len(quotes)):
        cur_quote = quotes[i]
        pre_quote = quotes[i-1]
        if cur_quote["close"] - pre_quote["close"] > 0:
            AU += cur_quote["close"] - pre_quote["close"]
            AD += 0
        else:
            AU += 0
            AD += pre_quote["close"] - cur_quote["close"]
    if AD <= 0:
        RS = 0
    else:
        RS = AU/AD
    RSI = 100 - (100/(1+RS))
    summary["bcom_week_rsi"] = RSI
    #calculate Momentum
    summary["bcom_week_momentum"] = float(last_q["close"]) - float(first_q["close"])
    #article summary
    avg_sentiment = 0.0
    news_id_list = []
    for i, news in enumerate(articles):
        news_id_list.append(news["_id"])
        try:
            avg_sentiment += float(news["sentiment"])
        except KeyError:
            avg_sentiment += 0.0
    if len(articles) > 0:
        avg_sentiment /= len(articles)
    summary["articles"] = news_id_list
    summary["avg_articles_sentiment"] = json.dumps(avg_sentiment)
    return summary


def generate_week_summary_by_dates(startdate, enddate, quote):
    articles = get_article_list_by_date_range(startdate, enddate)
    quotes = get_quotes_list(startdate, enddate, quote)
    if len(quotes) < 1:
        return
    #print quotes
    rst_summary = generate_summary(articles, quotes, quote)
    r = RestCall.send_raw_request("post", week_sum_url, rst_summary)
    print r.text


def main():
    args = parse_arguments()
    if args.startdate is not None and args.enddate is not None and args.index is not None:
        generate_week_summary_by_dates(args.startdate, args.enddate, args.index)
    else:
        print_how_to()


if __name__ == '__main__':
    main()