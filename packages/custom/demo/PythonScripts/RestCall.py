"""
Created on Sep 21, 2015

@author: hans wang
@author: Anna Dubovitskaya
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
        #print r.text
        return r

    def get(self, record_id=None):
        """
        Get records from database
        (default get newsarticles from database)
        :param record_id: (Optional) With article_id will return corresponding id record otherwise return all records in a list.
        :return: Response from server
        """
        if record_id is None:
            r = requests.get(self.connect_url)
        else:
            r = requests.get(self.connect_url+"/"+record_id)
        #print r.text
        return r

    def update(self, record_id, data):
        """
        Update/Edit record in database
        :param record_id: The id of the record to udpate
        :param data: The JSON data for new udpate data to pass in. (i.e. {'title": 'pythonTitle', 'content': 'pythonContent'})
        :return: Response from server
        """
        r = requests.put(self.connect_url+"/"+record_id, data)
        #print r.text
        return r

    def delete(self, record_id):
        """
        Delete record from database
        :param record_id: Record id to delete
        :return: Response from server
        """
        r = requests.delete(self.connect_url+"/"+record_id)
        #print r.text
        return r


def send_raw_request(req_type, endpoint_url, body_data=None):
    """
    Helper static function to send raw rest request
    In this function, request type, endpoint url and body data will need to be specified.
    Body data will be optional depdning on the type of the request and the desired operation.
    :param req_type: Support "get","post","put","delete"
    :param endpoint_url: URL to endpoint Rest API
    :param body_data: Body data that will be attached in request body
    :return: The response from Rest API endpoint (None if nothing or the type didn't match to support types.)
    """
    r = None
    if req_type == "get":
        r = requests.get(endpoint_url)
    elif req_type == "post":
        r = requests.post(endpoint_url,body_data)
    elif req_type == "put":
        r = requests.put(endpoint_url,body_data)
    elif req_type == "delete":
        r = requests.delete(endpoint_url)
    return r


def main():
    t = RestCaller()
    #print t.get()

if __name__ == '__main__':
    main()