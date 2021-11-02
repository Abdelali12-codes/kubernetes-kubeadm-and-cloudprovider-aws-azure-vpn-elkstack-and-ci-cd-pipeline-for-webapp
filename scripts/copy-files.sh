cd /home/azureuser/devops
sudo cp -r build/* nginx

# sudo cp ansible/deployments-services.yml /home/abdelali/
scp workloads/dep-service-nginx.yml ubuntu@10.10.1.53:/home/ubuntu/cluster
scp workloads/dep-service-web.yml ubuntu@10.10.1.53:/home/ubuntu/cluster
scp workloads/ingress-k8s.yml buntu@10.10.1.53:/home/ubuntu/cluster