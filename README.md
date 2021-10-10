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

# install the codedeploy agent

```
sudo yum install ruby -y
sudo yum install wget -y
cd /home/abdelali
wget https://aws-codedeploy-us-east-1.s3.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
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

sudo systemctl restart docker
sudo systemctl enable docker

### 3. initialization of the master node run the command below (run this command only on the master node)

- make sure that the kubelet and the container runtime have the same cgroup driver (it must be now systemd)

```
sudo docker info | grep -i cgroup
```

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
