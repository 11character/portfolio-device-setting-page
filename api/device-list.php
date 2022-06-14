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

        $stmt = $pdo->prepare($SQL_SELECT_TB_TX_LIST);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 값이 수자만 있는 문자열인 경우 JSON encoding시 숫자로 변환되기 때문에 공백을 추가한다.
        // 다른 API와 통일성 유지, 다른 항목의 숫자 자동 변환을 유지하기 위해 BLUETOOTH_UUID_1CH 항목만 별도로 취급한다.
        for ($i = 0; $i < count($result); $i++) {
            $result[$i]['BLUETOOTH_UUID_1CH'] .= ' ';
        }

        $data['code'] = 0;
        $data['message'] = 'ok';
        $data['data'] = $result;

    } catch (Exception $e) {
        $data['message'] = $e->getMessage();
    }

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>