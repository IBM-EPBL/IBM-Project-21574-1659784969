### install ibm cloud
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh

### login to ibm cloud
ibmcloud login

### create a resource group
ibmcloud cr namespace-add <my_namespace>

### tag the image
docker tag <source_image>:<tag> <region>.icr.io/<my_namespace>/<new_image_repo>:<new_tag>

### push the image to ibm cloud
ibmcloud cr login --client docker
docker push <region>.icr.io/<my_namespace>/<image_repo>:<tag>

### install k8s
ibmcloud plugin install container-service

