if [[ ! ${1} ]]; then
    echo "No fileId"
    exit 1
fi

sleep 5

for i in {1..86400}
do
    localhost="127.0.0.1"
    data=$(curl -sLf "http://${localhost}/download-percent?fileId=${1}" | jq -r ".")
    error=$(echo $data | jq -r ".error")

    if [[ $error == true ]]; then
        exit 1
    else
        sleep 3
    fi
done