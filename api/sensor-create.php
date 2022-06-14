<?php
    include './api-login-check.php';
    include '../config-db.php';

    $data = [
        'code' => 99,
        'message' => 'data not found.'
    ];

    if (isset($_POST['name']) && trim($_POST['name'])) {
        try {
            $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                ':IS_USE' => $_POST['isUse'],
                ':NAME' => $_POST['name'],
                ':CONNECT_TYPE' => $_POST['type'],
                ':MIN_VOLTAGE' => $_POST['minVoltage'],
                ':MAX_VOLTAGE' => $_POST['maxVoltage'],
                ':MIN_VALUE' => $_POST['minValue'],
                ':MAX_VALUE' => $_POST['maxValue'],
                ':PROTOCOL' => $_POST['protocol'],
                ':UUID' => $_POST['uuid']
            ];

            $pdo->prepare($SQL_INSERT_TB_SENSOR_LIST)->execute($value);

            $data['code'] = 0;
            $data['message'] = 'ok';

        } catch (Exception $e) {
            $data['message'] = $e->getMessage();
        }
    }

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>