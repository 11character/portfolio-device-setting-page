<?php
    include './api-login-check.php';
    include '../config-db.php';

    $data = [
        'code' => 99,
        'message' => 'data not found.'
    ];

    if (isset($_POST['id'])) {
        try {
            $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                ':SEQ_ID' => $_POST['id']
            ];

            $pdo->prepare($SQL_DELETE_TB_SENSOR_LIST)->execute($value);

            $data['code'] = 0;
            $data['message'] = 'ok';

        } catch (Exception $e) {
            $data['message'] = $e->getMessage();
        }
    }

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>