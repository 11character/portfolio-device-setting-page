<?php
    include './api-login-check.php';
    include '../config-db.php';

    $data = [
        'code' => 99,
        'message' => 'data not found.'
    ];

    if (isset($_GET['usaNumber']) && isset($_GET['sensorName'])) {
        try {
            $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                ':USA_NUM' => $_GET['usaNumber'],
                ':CHANNEL_NAME' => $_GET['sensorName']
            ];

            $stmt = $pdo->prepare($SQL_SELECT_TB_TX_DATA_COUNT);
            $stmt->execute($value);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stert = $result[0]['COUNT'];
            $count = 100;

            if ($stert > $count) {
                $stert = $stert - $count;

            } else {
                $stert = 0;
            }

            $value[':START'] = $stert;
            $value[':COUNT'] = $count;

            $stmt = $pdo->prepare($SQL_SELECT_TB_TX_DATA);
            $stmt->execute($value);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $data['code'] = 0;
            $data['message'] = 'ok';
            $data['data'] = $result;

        } catch (Exception $e) {
            $data['message'] = $e->getMessage();
        }
    }

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>