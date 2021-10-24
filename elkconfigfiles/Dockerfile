
FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install openjdk-8-jdk -y
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME
RUN apt-get update
RUN useradd -s /bin/bash -d /home/abdelali -G sudo -m abdelali
USER root
WORKDIR /home/abdelali/app
#RUN chown -R abdelali:abdelali /home/abdelali/app
RUN apt-get install wget -y
RUN wget https://artifacts.elastic.co/downloads/logstash/logstash-7.15.1-linux-x86_64.tar.gz
RUN tar xvzf logstash-7.15.1-linux-x86_64.tar.gz
RUN rm -f logstash-7.15.1-linux-x86_64.tar.gz
COPY nginx.conf .
RUN mkdir /var/log/nginx
RUN touch /var/log/nginx/access.log && touch /var/log/nginx/error.log
#USER abdelali
CMD logstash-7.15.1/bin/logstash -f nginx.conf
