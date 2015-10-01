"""
Created on Sep 21, 2015

@author: hans wang
"""
import requests
# import json


class RestCaller:

    mean_news_article_url = "http://localhost:3000/api/demo/newsarticles"
    connect_url = None

    def __init__(self, url=mean_news_article_url):
        self.connect_url = url
        print "Route connect: " + url

    def post(self, data):
        """
        Post rest call which will create an records into database.
        (default to newsarticles)
        :param data: JSON data (i.e. {'title": 'pythonTitle', 'content': 'pythonContent'})
        :return: Response from server
        """
        r = requests.post(self.connect_url, data)
        print r.text
        return r.text

    def get(self, record_id=None):
        """
        Get records from database
        (default get newsarticles from database)
        :param record_id: (Optional) With article_id will return corresponding id record otherwise return all records in a list.
        :return: Response from server
        """
        if id is None:
            r = requests.get(self.connect_url)
        else:
            r = requests.get(self.connect_url+"/"+record_id)
        print r.text
        return r.text

    def update(self, record_id, data):
        """
        Update/Edit record in database
        :param record_id: The id of the record to udpate
        :param data: The JSON data for new udpate data to pass in. (i.e. {'title": 'pythonTitle', 'content': 'pythonContent'})
        :return: Response from server
        """
        r = requests.put(self.connect_url+"/"+record_id, data)
        print r.text
        return r.text

    def delete(self, record_id):
        """
        Delete record from database
        :param record_id: Record id to delete
        :return: Response from server
        """
        r = requests.delete(self.connect_url+"/"+record_id)
        print r.text
        return r.text


def main():
    t = RestCaller()
    t.delete("55f886ef5f191ffb2fd3b331")

if __name__ == '__main__':
    main()