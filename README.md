# aws-pipeline-kubernetes-jenkins-ansible-dockerhub-domaincontroller-vpn-coporate-datacentre-reactjs

# setup jenkins on ubuntu ec2 instance image

```
sudo apt-get update
sudo apt-get install openjdk-8-jdk -y
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian binary/ > \
    /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install jenkins
sudo service jenkins start
```

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

### 1. run the following command on the both instances you created above

- setup a new hostname

```
sudo hostnamectl set-hostname \
$(curl -s http://169.254.169.254/latest/meta-data/local-hostname)
```

- install kubelet, kubeadm and kubectl

```
sudo apt-get update && sudo apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
sudo apt install docker.io -y

```

- edit the docker daemon file to change the cgroudriver to systemd instead of cgroufs

```
sudo nano /etc/docker/daemon.json
```

- copy and paste the below content

```
  {
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
  "max-size": "100m"
  },
  "storage-driver": "overlay2"
  }
```

```
* run the below commands to apply the changes
sudo systemctl restart docker
sudo systemctl enable docker
```

### 3. initialization of the master node run the command below (run this command only on the master node)

- make sure that the kubelet and the container runtime have the same cgroup driver (it must be now systemd)

- create aws.yml file under /etc/kubernetes/ copy and paste to it the below

```
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
networking:
  serviceSubnet: 10.100.0.0/16
  podSubnet: 10.244.0.0/16
apiServer:
  extraArgs:
    cloud-provider: aws
controllerManager:
  extraArgs:
    cloud-provider: aws
clusterName: kubernetes

```

sudo kubeadm init --config /etc/kubernetes/aws.yml

### 4. install the flannel network plugin on the control plane (master node in our case)

```

sudo kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

```

### join the worker nodes to the cluster

- create node.yml file under /etc/kubernetes in the worker node you want to join it to the cluster

```
apiVersion: kubeadm.k8s.io/v1beta2
kind: JoinConfiguration
discovery:
  bootstrapToken:
    token: "1egdvy.cnkm4u65vaijwu1r"
    apiServerEndpoint: "10.10.1.40:6443 "
    caCertHashes:
      - "sha256:b0546d2e377eb4790ae983bfb77d07dfed966aafbf9c0a3207782e169d6a6251"
nodeRegistration:
  name: ip-10-10-1-244.us-west-2.compute.internal
  kubeletExtraArgs:
    cloud-provider: aws
```

# kubernetes RBAC

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

### set the kubernetes cluster and the context

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

# configure the azure vm to register it to codedeploy on-premise instances

## 1. create policies for the user

## 2. create the user and save the access and secret key (download the csv file)

## 3. create codedeploy.onpremises.yml under /etc/codedeploy-agent/conf

```

aws_access_key_id: AKIARFMB6SUSKPW43KEI
aws_secret_access_key: 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
iam_user_arn: arn:aws:iam::080266302756:user/root
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

## 7. register azure vm to codedeploy on-premise

```

aws deploy register-on-premises-instance --instance-name AssetTag12010298EX --iam-user-arn arn:aws:iam::080266302756:user/root

```

```

```

```

```
