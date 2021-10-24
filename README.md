# aws-pipeline-kubernetes-jenkins-ansible-dockerhub-domaincontroller-vpn-coporate-datacentre-reactjs

# setup ansible server

- make sure to install the ansible software as a root !!

- if you are on ubuntu

```
sudo su
apt install python-pip -y
pip install ansible
```

- if you are on amazon linux or centos or redhat

```
sudo su
yum install python-pip -y
pip install ansible
```

# create the tag for aws resources

```
key= kubernetes.io/cluster/kubernetes and value= owned
```

# Set up the kubernetes cluster

- set up the hostname for the masters and worker nodes

```
sudo hostnamectl set-hostname name-of-the-host
```

### 1. set up the loadbalancer for the k8s cluster HAproxy

- install haproxy software

```
sudo apt-get update && sudo apt-get install haproxy -y
```

- copy and paste the below content in /etc/haproxy/haproxy.conf

```
frontend kubernetes-frontend
    bind 10.10.1.172:6443
    mode tcp
    option tcplog
    default_backend kubernetes-backend

backend kubernetes-backend
    mode tcp
    option tcp-check
    balance roundrobin
    server master1 10.10.1.16:6443 check fall 3 rise 2
    server master2 172.16.16.223:6443 check fall 3 rise 2

```

### 2. run the following command on the instances of the clusters

- look at the node-conf.sh file under kubernetes foler of the project

### 3. initialization of the master node run the command below (run this command only on the master node)

- look at the aws.yml file under kubernetes folder of the project

- after finishing the previous step, run the below command

* for kubeadm integration with aws run the below command

```
sudo kubeadm init --config /etc/kubernetes/aws.yml --upload-certs
```

- for kubeadm without aws run below command as root

```
kubeadm init --control-plane-endpoint="server-ip:6443" --apiserver-advertise-address= master-ip-addres --pod-network-cidr= 10.244.0.0/16 --upload-certs
```

### 4. join the worker nodes and masternode to the cluster

- if you integrated kubeadm with aws provider go to the node.yml under kubernetes folder to join your woker node to the cluster

- else run the command that appear when you initiate the kubeadm

- if you integrated kubeadm with aws provider go to the controller.yml under kubernetes folder to join your master node to the cluster

* else run the command that appear when you initiate the kubeadm

### 5. install the flannel network plugin on the control plane (master node in our case)

```

sudo kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

```

### 6. setting the admin node of the cluster

- install the kubectl (tool to interact with our cluster)

```
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
```

- copy the config file from the master node to the admin node

```
mkdir -p $HOME/.kube
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

- copy the /etc/kubernetes/admin.conf file to the admin host under $HOME/.kube/config (watch the lab on my youtube to understand how i achieved that)

![haproxy](https://user-images.githubusercontent.com/67081878/138596740-a9842526-b649-4d90-b70e-8959469d35cf.png)

# kubernetes RBAC

## 1. Create the user and generate the private key, certificate signing requets and sign the certificate by the kubernetes certificate authority by the admin of the cluster

- create the user on ubuntu

```
sudo useradd -s /bin/bash -d /home/abdelali/ -m -G sudo abdelali
```

- create private key for the user

```

openssl genrsa -out private-key.key 2048

```

- create certificate sign request (csr)

* comment RANDFILE = $ENV::HOME/.rnd line in /etc/ssl/openssl.cnf

```

openssl req -new -key private-key.key -out request.csr -subj "/CN=abdelali/O=abdelali"

```

- sign the generated certificate by the kubernetes admin

```

openssl x509 -req -in request.csr -CA kubernetes.crt -CAkey kubernetes.key -CAcreateserial -out abdelali.crt -days 365

```

## 2. Set the kubernetes cluster and the context

- set the cluster name and the server

```

kubectl config set-cluster name-of-cluster --server =url

```

- set the context of the user

```

kubectl config set-context my-context --user abdelali --cluster name-of-cluster

```

- set the current context

```

kubectl config use-context my-context

```

- set the certificate and the private key of the user

```

kubectl config set-credentials abdelali --client-certificate=/home/abdelali/kubernetes/abdelali.crt --client-key=/home/abdelali/kubernetes/private-key.key

```

- set the certificate authority for the cluster

```

kubectl config set-cluster name-of-cluster --certificate-authority=/home/abdelali/kubernetes/kubernetes.crt

```

# Kubeernetes Settings

## to obtain the value of certificate-jey to join your other master node to k8s cluster

```
kubeadm certs certificate-key
```

## to obtain the value of --token

```
kubeadm token list
kubeadm token create
```

- or

```
kubeadm token create --print-join-command
```

## to obtain the the value of --discovery-token-ca-cert-hash

```
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```

# configure the azure vm to register it to codedeploy on-premise instances

## 1. create policies for the user

## 2. create the user and save the access and secret key (download the csv file)

## 3. create codedeploy.onpremises.yml under /etc/codedeploy-agent/conf

```

aws_access_key_id: xxxxxxxxxxxxxx
aws_secret_access_key: xxxxxxxxxxxxxxxxxxxxxx
iam_user_arn: arn:aws:iam::xxxxxxxxxxxxxxx:user/root
region: us-west-2

```

## 4. Set the AWS_REGION environment variable (Ubuntu Server and RHEL only)

```

export AWS_REGION=us-west-2

```

## 5. install the codedeploy agent

```
sudo apt-get update -y
sudo apt-get install ruby -y
sudo apt-get install wget -y
cd /home/abdelali
wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

```

## 6. Install and configure the AWS CLI

- using pip

```

sudo yum install python-pip
pip install awscli

```

- or

```

sudo yum install awscli -y or sudo apt install awscli -y

```

- configure your user on azure vm

```
aws configure
```

## 7. register azure vm to codedeploy on-premise

```

aws deploy register-on-premises-instance --instance-name AssetTag12010298EX --iam-user-arn arn:aws:iam::xxxxxxxxxxxxxxx:user/root

```

## 8. deregister azure vm from codedeploy on-premise

```
aws deploy deregister-on-premises-instance --instance-name AssetTag12010298EX
```

# elk stack

## elasticsearch

- Download and install the public signing key:

```
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install elasticsearch
```

## kibana

- if you run kibana and elasticsearch in the same machine so you need just to run the below command

```

sudo apt-get update && sudo apt-get install kibana

```

- if you run kibana in seperate machine so you need to follow the same steps as you did with elasticesearch

```

wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install kibana

```

## logstash on ubuntu

```

wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt-get update && sudo apt-get install logstash

```

- configure the file

- get to /usr/share/logstash and run the command below

```

bin/logstash -f /etc/logstash/conf.d/nginx.conf

```

## logstash on docker

```

```

# provide password-protected access to your kibana

- install the below packages

```
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install nginx apache2-utils
sudo apt-get install python-certbot-nginx
sudo certbot --nginx -d my-elk-stack-vps.com
```

- run the below command in the directory (/etc/nginx) and enter your password

```
sudo htpasswd -c /etc/nginx/htpasswd.users kibanaadmin
```

- if you are using nginx on ubuntu go under /etc/nginx/sites-enabled/default and paste the below lines

```
auth_basic "Restricted Access";
auth_basic_user_file /etc/nginx/htpasswd.users;
```

# Synchronize users between AWS Microsoft AD and Azure AD
