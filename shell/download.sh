if [[ ! ${1} ]]; then
    echo "No fileId"
    exit 1
fi

localhost="127.0.0.1"
data=$(curl -sLf "http://${localhost}/data?fileId=${1}" | jq -r ".")
error=$(echo $data | jq -r ".error")

if [[ $error == true ]]; then
    msg=$(echo $data | jq -r ".msg")
    echo "${msg}"
    exit 1
fi

type=$(echo $data | jq -r ".type")
source=$(echo $data | jq -r ".source")
slug=$(echo $data | jq -r ".slug")
quality=$(echo $data | jq -r ".quality")
outPutPath=$(echo $data | jq ".outPutPath"  --raw-output)
root_dir=$(echo $data | jq -r ".root_dir")

sudo bash ${root_dir}/shell/updatePercent.sh ${slug} > /dev/null &

if [[ $type == "gdrive" ]]; then

    outPut=${outPutPath}/file_${quality}
    downloadtmpSave="${outPutPath}/file_${quality}.txt"

    #gdown "${source}" -O "${outPut}"  >> "${downloadtmpSave}" 2>&1
    # ดาวน์โหลดหน้าแรกและบันทึกไว้ใน cookie.txt
curl -c ./cookie.txt -s -L "https://drive.google.com/uc?export=download&id=${source}" > /dev/null


# ดาวน์โหลดไฟล์จริงๆ โดยระบุความคืบหน้าและบันทึกลงใน ${filename}
curl -Lb ./cookie.txt "https://drive.google.com/uc?export=download&confirm=$(awk '/download/ {print $NF}' ./cookie.txt)&id=${source}" -o ${outPut} --progress-bar > ${downloadtmpSave} 2>&1

# ลบไฟล์ cookie.txt เนื่องจากไม่ได้ใช้แล้ว
rm ./cookie.txt

fi

if [[ $type == "upload" ]]; then

    outPut=${outPutPath}/file_${quality}
    downloadtmpSave="${outPutPath}/file_${quality}.txt"
    
    curl "http:${source}" -o ${outPut} --progress-bar > ${downloadtmpSave} 2>&1
fi

if [[ $type == "direct" ]]; then

    outPut=${outPutPath}/file_${quality}
    downloadtmpSave="${outPutPath}/file_${quality}.txt"
    
    curl "http:${source}" -o ${outPut} --progress-bar > ${downloadtmpSave} 2>&1
fi

echo "process and remote ${slug}"
#อัพโหลดไปยัง storage
curl -sS "http://${localhost}/remote?fileId=${1}"

echo "${slug} processed"
if [[ $type == "upload" ]]; then

    curl -sS "http:${source}/delete-video"
fi
exit 1