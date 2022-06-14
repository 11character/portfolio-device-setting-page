<?php
    include './api-login-check.php';
    include '../config-db.php';
    include '../config-path.php';

    $data = [
        'code' => 99,
        'message' => 'data not found.'
    ];

    // 0번 기기는 지우지 않는다.
    if (isset($_POST['id']) && $_POST['id'] > 0) {
        try {
            $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [':SEQ_ID' => $_POST['id']];

            // 기존 정보 조회.
            $stmt = $pdo->prepare($SQL_SELECT_TB_TX_INFO);
            $stmt->execute($value);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($result) > 0) {
                // 관련 파일 제거.
                $info = $result[0];
                $number = $info['USA_NUM'];

                $bluetooth_file_path = $PROTOCOL_CONFIG_PATH . '/' . $FREFIX_BLUETOOTH_NAME . $number . '.txt';
                $serial_file_path = $PROTOCOL_CONFIG_PATH . '/' . $FREFIX_SERIAL_NAME . $number . '.txt';

                if (is_file($bluetooth_file_path)) {
                    unlink($bluetooth_file_path);
                }

                if (is_file($serial_file_path)) {
                    unlink($serial_file_path);
                }

                // DB 제거.
                $pdo->prepare($SQL_DELETE_TB_TX_INFO)->execute($value);
            }

            $data['code'] = 0;
            $data['message'] = 'ok';

        } catch (Exception $e) {
            $data['message'] = $e->getMessage();
        }
    }

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>