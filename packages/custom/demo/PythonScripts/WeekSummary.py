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


def get_quotes_list(startdate, enddate):
    quote_rest = RestCall.send_raw_request("get", "http://localhost:3000/api/demo/quotes_by_date_range?startdate=" + startdate + "&enddate=" + enddate + "indexsymbol=^DJC")
    quotes = quote_rest.json()
    return quotes


def get_all_quotes_list():
    quote_rest = RestCall.send_raw_request("get", "http://localhost:3000/api/demo/quotes_by_symbol?indexsymbol=^DJC")
    quotes = quote_rest.json()
    return quotes


def generate_summary(articles, quotes):
    summary = {
        "week_start_date":None,
        "week_end_date":None,
        "bcom_indices":None,
        "bcom_max":None,
        "bcom_min":None,
        "bcom_avg_slope":None,
        "bcom_week_momentum":None,
        "bcom_week_rsi":None,
        "articles":None,
        "avg_articles_sentiment":None
    }
    for q in quotes:
        print q["qdate"]
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
        if quote["close"] > q_max: q_max = float(quote["close"])
        if quote["close"] < q_min: q_min = float(quote["close"])
        if i > 0:
            total_diff += float(quotes[i]["close"]) - float(quotes[i-1]["close"])
        q_id_list.append(quote["_id"])
    total_diff /= (len(quotes)-1)
    summary["bcom_indices"] = q_id_list
    summary["bcom_max"] = json.dumps(q_max)
    summary["bcom_min"] = json.dumps(q_min)
    summary["bcom_avg_slope"] = json.dumps(total_diff)
    #article summary
    avg_sentiment = 0.0
    news_id_list = []
    for i, news in enumerate(articles):
        news_id_list.append(news["_id"])
        avg_sentiment += float(news["sentiment"])
    avg_sentiment /= len(articles)
    summary["articles"] = news_id_list
    summary["avg_articles_sentiment"] = json.dumps(avg_sentiment)

    return summary


def main():
    quotes = get_all_quotes_list()
    #first_q = quotes[0];
    #last_q = quotes[-1];
    #start_date = first_q["qdate"];
    #end_date = last_q["qdate"];
    articles = get_all_article_list()
    print generate_summary(articles, quotes)
    rc = RestCaller(week_sum_url)
    rc.post(generate_summary(articles, quotes))

    #print start_date
    #print end_date

if __name__ == '__main__':
    main()