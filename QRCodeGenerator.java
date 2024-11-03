package qrcode;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import java.io.FileReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class QRCodeGenerator {

    public static void main(String[] args) throws Exception {
        Path outputPath = Paths.get("src/main/java/qrcode/generated-qr-codes");
        Files.createDirectories(outputPath);

        try (CSVParser parser = new CSVParser(new FileReader("src/main/resources/waagen.csv"),
             CSVFormat.DEFAULT.withHeader())) {

            for (var record : parser) {
                String uuid = record.get("uuid");
                String qrContent = "SOMEIDENTIFIER:" + uuid;
                Path qrPath = outputPath.resolve("qr-" + uuid + ".png");

                BitMatrix matrix = new MultiFormatWriter().encode(qrContent,BarcodeFormat.QR_CODE,300,300);

                MatrixToImageWriter.writeToPath(matrix, "PNG", qrPath);
                System.out.println("QR-Code erstellt für: " + uuid);
            }
        }
    }
}