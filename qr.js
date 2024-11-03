app.controller('QRCodeController', ['$scope', '$http', function($scope, $http) {
    $scope.uuid = '';

    $scope.scanQRCode = function() {
        cordova.plugins.barcodeScanner.scan(
            function(result) {
                if (!result.cancelled) {
                    var qrContent = result.text;

                    if (qrContent.startsWith("SOMEIDENTIFIER:")) {
                        var extractedUuid = qrContent.replace("SOMEIDENTIFIER:", '').trim();

                        var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

                        if (uuidRegex.test(extractedUuid)) {
                            $scope.uuid = extractedUuid;
                            console.log('Extrahierte und geprüfte UUID: ' + $scope.uuid);

                            $http.post('https://dein-backend-url/api/qr-data', { uuid: $scope.uuid })
                                .then(function(response) {
                                    console.log('Erfolgreich an Backend gesendet:', response.data);
                                })
                                .catch(function(error) {
                                    console.error('Fehler beim Senden:', error);
                                });
                        } else {
                            console.error('Ungültige UUID: ' + extractedUuid);
                        }
                    } else {
                        console.error('Ungültiger QR-Code. Identifier "SOMEIDENTIFIER:" fehlt.');
                    }
                }
            },
            function(error) {
                console.error('Scan-Fehler:', error);
            },
            {
                preferFrontCamera: false,
                showFlipCameraButton: true,
                showTorchButton: true,
                prompt: "Scanne den QR-Code",
                resultDisplayDuration: 500,
                formats: "QR_CODE",
                orientation: "portrait",
                disableAnimations: true,
                disableSuccessBeep: false
            }
        );
    };
}]);
