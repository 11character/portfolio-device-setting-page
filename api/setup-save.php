<?php
    include './api-login-check.php';
    include '../config-db.php';

    $data = [
        'code' => 99,
        'message' => 'data not found.'
    ];

    if (!empty($_POST)) {
        try {
            $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                ':SERIAL_DEVICE' => $_POST['serialDevice'],
                ':BAUD_RATE' => $_POST['baudRate'],
                ':SERIAL_DEVICE_MCU' => $_POST['serialDeviceMcu'],
                ':BAUD_RATE_MCU' => $_POST['baudRateMcu'],
                ':REQUEST_INTERVAL' => $_POST['requestInterval'],
                ':SDR_CHANNEL' => $_POST['sdrChannel'],
                ':SERVER_TYPE' => $_POST['serverType'],
                ':SERVER_IP' => $_POST['serverIp'],
                ':SERVER_PORT' => $_POST['serverPort'],
                ':SERVER_TOPIC' => $_POST['serverTopic'],
                ':AP_USE' => $_POST['apUse'],
                ':AP_SSID' => $_POST['apSsid'],
                ':AP_PASSWORD' => $_POST['apPassword'],
                ':AP_CHANNEL' => $_POST['apChannel'],
                ':USE_BOOTING_LOG' => $_POST['useBootingLog'],
                ':USE_MESSAGE_LOG' => $_POST['useMessageLog'],
                ':USE_NETWORK_LOG' => $_POST['useNetworkLog']
            ];

            $pdo->prepare($SQL_UPDATE_TB_SETUP)->execute($value);

            $data['code'] = 0;
            $data['message'] = 'ok';

        } catch (Exception $e) {
            $data['message'] = $e->getMessage();
        }
    }

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>