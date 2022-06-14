<?php
    include './api-login-check.php';
    include '../config-db.php';

    $data = [
        'code' => 99,
        'message' => 'data not found.'
    ];

    try {
        $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->prepare($SQL_SELECT_TB_SETUP);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($result) > 0) {
            $data['code'] = 0;
            $data['message'] = 'ok';
            $data['data'] = $result[0];
        }

    } catch (Exception $e) {
        $data['message'] = $e->getMessage();
    }

    echo json_encode($data);
?>