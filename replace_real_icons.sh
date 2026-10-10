#!/bin/bash

GEMINI="/Users/soham/Downloads/paytm-hacky/gemini.png"
GPAY="/Users/soham/Downloads/paytm-hacky/gpay.png"

IQOO_RES="/Users/soham/Downloads/paytm-hacky/Iqooistant/android/app/src/main/res"
CHROME_RES="/Users/soham/Downloads/paytm-hacky/ChromePeApp/android/app/src/main/res"

folders=("mipmap-mdpi" "mipmap-hdpi" "mipmap-xhdpi" "mipmap-xxhdpi" "mipmap-xxxhdpi")
sizes=(48 72 96 144 192)

for i in "${!folders[@]}"; do
  folder="${folders[$i]}"
  size="${sizes[$i]}"
  
  target_dir="$IQOO_RES/$folder"
  sips -z $size $size -s format png "$GEMINI" --out "$target_dir/ic_launcher.png"
  sips -z $size $size -s format png "$GEMINI" --out "$target_dir/ic_launcher_round.png"
  
  target_dir2="$CHROME_RES/$folder"
  sips -z $size $size -s format png "$GPAY" --out "$target_dir2/ic_launcher.png"
  sips -z $size $size -s format png "$GPAY" --out "$target_dir2/ic_launcher_round.png"
done

