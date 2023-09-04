if [[ ! ${1} ]]; then
    echo "No dir"
    exit 1
fi

sleep 1

root_dir=${1}
localhost="127.0.0.1"

sudo rm -rf $root_dir/public/*

pm2 restart all
