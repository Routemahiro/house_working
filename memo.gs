// LINEAPIドキュメント：https://developers.line.biz/ja/reference/messaging-api/
// LINEAPIの仕様などで参考：https://qiita.com/kakakaori830/items/52e52d969800de61ce28

// OpenAIドキュメント：https://platform.openai.com/docs/api-reference/introduction

// WebアプリのURLを変えずにデプロイする方法：https://www.aruse.net/entry/2022/10/09/130019
// GAS Web AppをClaspからデプロイ：https://qiita.com/ume3003/items/cd9d05dff014952a73f8

// GASのログをGCPに紐づける方法：https://zenn.dev/nenenemo/articles/db5f4d3930276c
// 
// 気象庁のAPIのエリアコードで参考にした：https://zenn.dev/inoue2002/articles/2e07da8d0ca9ca

// open-meteo（天気のAPI）で参考にした：https://paiza.hatenablog.com/entry/2021/11/04/130000
// open-meteoの公式ドキュメント（URLhttps://open-meteo.com/en/docs
// WMO Weather interpretation codes（要するに、天候を表すコード）の参考ページ：https://www.jodc.go.jp/data_format/weather-code_j.html
// UV_INDEXの強さについての指標のページ：https://db.cger.nies.go.jp/gem/ja/uv/uv_index/outline/uvindex.html

// 【設定手順】
// GCP紐づけ
// GCPにGoogle drive API　Google Image serviceの権限追加
// Google apps プロジェクトにGoogleDRIVE追加（V3で）

// お家用LINEBOTのシート「babyData」に必要なデータを入力
// updateCoordinatesを実行して、緯度と経度をpropertyに登録
// その他、色々propertyに登録必要。⚡️⚡️このあたり、一気にわかりやすくしようかな。例えば、babyDataに書き込んでから関数を実行したら、babyDataの値は消して、propertyに登録されるみたいな⚡️⚡️