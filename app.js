const path = require("path");
const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const http = require("http");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(express.static(path.resolve(__dirname, "public")));

// tmpディレクトリを生成する
if (fs.existsSync(path.resolve(__dirname, "./tmp"))) {
  console.log('"tmp"ディレクトリの存在を確認、処理を続行します。');
} else {
  console.log(
    '"tmp"ディレクトリが確認できません。\n"tmp"ディレクトリを生成します。'
  );
  fs.mkdir(path.resolve(__dirname, "./tmp"), (err) => {
    if (err) {
      console.log("tmpディレクトリはすでに存在します。");
    } else {
      console.log("生成完了");
    }
  });
}

app.use(cors());
/*
app.listen(3000, () => {
  console.log("Server Works !!! At port 3000");
});
*/
var port = process.env.PORT || 3000;
app.listen(port);
console.log(port + "番ポートでnodeを起動");

app.get("/", (req, res) => {
  res.send("3000ポートで起動中");
});

app.get("/download", (req, res) => {
  //urlとaudionameを取得
  var url = req.query.url;
  var audioname = req.query.title;

  //パスを指定
  const mp4FilePath = path.resolve(__dirname, `./tmp/${audioname}.mp4`);
  fs.writeFile(`tmp/${audioname}.mp3`, ``, function (err) {
    if (err) {
      throw err;
    }
    console.log(`tmp/${audioname}.mp3が作成されました`);
  });
  const mp3FilePath = path.resolve(__dirname, `./tmp/${audioname}` + `.mp3`);

  //Ytdlでダウンロードする
  console.log("動画のダウンロードを開始します。");
  const hwm = 200 * 1024;
  const ytdlStream = ytdl(url, { quality: "lowest" });
  ytdlStream.pipe(fs.createWriteStream(mp4FilePath, { highWaterMark: hwm }));
  ytdlStream.on("error", (err) => {
    console.error(err);
    res
      .status(400)
      .send(
        "YouTubeをダウンロードする時にエラーが発生しました。もう一度やり直してください。\nネットワークに接続されていないか、URLが正しいか確認してください。"
      );
    console.log(err);
  });
  ytdlStream.on("end", () => {
    console.log(`(${audioname}.mp4のダウンロードが完了しました。`);
    console.log(`続いて、(${audioname}.mp3への変換を開始します。`);
    //ffmpegで変換する
    exec(`ffmpeg -y -i ${mp4FilePath} ${mp3FilePath}`, (err) => {
      if (err) {
        console.error(err);
        console.log("ffmpegエラー");
      } else {
        res.set({
          "Content-Disposition": `attachment; filename=${audioname}.mp3`,
        });
        readStream = fs.createReadStream(mp3FilePath);
        readStream.pipe(res);
        readStream.on("end", () => {
          console.log("全ての処理が完了しました。");
        });
      }
    });
  });
});

app.get("/downloadtest", (req, res) => {
  const mp3FilePath = path.resolve(__dirname, `./tmp/a` + `.mp3`);
  console.log(mp3FilePath);
  res.set({
    "Content-Disposition": `attachment; filename=${audioname}.mp3`,
  });
  readStream = fs.createReadStream(mp3FilePath);
  readStream.pipe(res);
  readStream.on("end", () => {
    console.log("all finished.");
  });
});
