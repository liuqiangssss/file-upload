import SparkMD5 from "spark-md5";

self.onmessage = function (e) {
    const { chunks } = e.data;
    const spark = new SparkMD5.ArrayBuffer();

    let currentChunk = 0;

    function loadNext() {
        if (currentChunk < chunks.length) {
            const reader = new FileReader();
            reader.onload = function (event) {
                spark.append(event.target!.result as ArrayBuffer)
                currentChunk++;
                loadNext();
            };
            reader.readAsArrayBuffer(chunks[currentChunk]);
        } else {
            self.postMessage({ hash: spark.end() });
        }
    }

    loadNext();
};
