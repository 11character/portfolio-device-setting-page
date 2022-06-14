<?php
    include './api-login-check.php';
    include '../config-db.php';
    include '../config-path.php';

    $data = [
        'code' => 99,
        'message' => 'data not found.'
    ];

    // 값 검증.
    $bool = isset($_POST['id']) && $_POST['id'] > 0;
    $bool = $bool && isset($_POST['number']) && $_POST['number'] > -1;
    $bool = $bool && isset($_POST['analogName1ch']) && trim($_POST['analogName1ch']);
    $bool = $bool && isset($_POST['analogName2ch']) && trim($_POST['analogName2ch']);
    $bool = $bool && isset($_POST['digitalName1ch']) && trim($_POST['digitalName1ch']);
    $bool = $bool && isset($_POST['digitalName2ch']) && trim($_POST['digitalName2ch']);

    if ($bool) {
        try {
            $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // 기존 정보 조회.
            $stmt = $pdo->prepare($SQL_SELECT_TB_TX_INFO);
            $stmt->execute([':SEQ_ID' => $_POST['id']]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($result) > 0) {
                $old_info = $result[0];
                $old_number = $old_info['USA_NUM'];
                $new_number = $_POST['number'];

                // 관련 파일 이름 변경.
                if ($old_number != $new_number) {
                    $bluetooth_front_part = $PROTOCOL_CONFIG_PATH . '/' . $FREFIX_BLUETOOTH_NAME;
                    $serial_front_part = $PROTOCOL_CONFIG_PATH . '/' . $FREFIX_SERIAL_NAME;

                    $old_bluetooth_file_path = $bluetooth_front_part . $old_number . '.txt';
                    $old_serial_file_path = $serial_front_part . $old_number . '.txt';

                    $new_bluetooth_file_path = $bluetooth_front_part . $new_number . '.txt';
                    $new_serial_file_path = $serial_front_part . $new_number . '.txt';

                    // 변경할 이름과 같은 파일이 있는 경우 제거.
                    if (is_file($new_bluetooth_file_path)) {
                        unlink($new_bluetooth_file_path);
                    }

                    if (is_file($new_serial_file_path)) {
                        unlink($new_serial_file_path);
                    }

                    // 이름 변경.
                    if (is_file($old_bluetooth_file_path)) {
                        rename($old_bluetooth_file_path, $new_bluetooth_file_path);
                    }

                    if (is_file($old_serial_file_path)) {
                        rename($old_serial_file_path, $new_serial_file_path);
                    }
                }

                // DB 업데이트.
                $value = [
                    ':SEQ_ID' => $_POST['id'],
                    ':USA_NUM' => $_POST['number'],
                    ':DEVICE_TYPE' => $_POST['typeCode'],
                    ':IS_USE' => $_POST['isUse'], // true, false 값이 1, 0으로 넘어온다.
                    ':IS_ONE_WAY' => $_POST['isOneWay'], // true, false 값이 1, 0으로 넘어온다.

                    ':ANALOG_IS_USE_1CH' => $_POST['analogIsUse1ch'], // true, false 값이 1, 0으로 넘어온다.
                    ':ANALOG_NAME_1CH' => $_POST['analogName1ch'],
                    ':ANALOG_MIN_VOLTAGE_1CH' => $_POST['analogMinVoltage1ch'],
                    ':ANALOG_MAX_VOLTAGE_1CH' => $_POST['analogMaxVoltage1ch'],
                    ':ANALOG_MIN_VALUE_1CH' => $_POST['analogMinValue1ch'],
                    ':ANALOG_MAX_VALUE_1CH' => $_POST['analogMaxValue1ch'],

                    ':ANALOG_IS_USE_2CH' => $_POST['analogIsUse2ch'], // true, false 값이 1, 0으로 넘어온다.
                    ':ANALOG_NAME_2CH' => $_POST['analogName2ch'],
                    ':ANALOG_MIN_VOLTAGE_2CH' => $_POST['analogMinVoltage2ch'],
                    ':ANALOG_MAX_VOLTAGE_2CH' => $_POST['analogMaxVoltage2ch'],
                    ':ANALOG_MIN_VALUE_2CH' => $_POST['analogMinValue2ch'],
                    ':ANALOG_MAX_VALUE_2CH' => $_POST['analogMaxValue2ch'],

                    ':DIGITAL_IS_USE_1CH' => $_POST['digitalIsUse1ch'], // true, false 값이 1, 0으로 넘어온다.
                    ':DIGITAL_NAME_1CH' => $_POST['digitalName1ch'],
                    ':DIGITAL_MIN_VALUE_1CH' => $_POST['digitalMinValue1ch'],
                    ':DIGITAL_MAX_VALUE_1CH' => $_POST['digitalMaxValue1ch'],

                    ':DIGITAL_IS_USE_2CH' => $_POST['digitalIsUse2ch'], // true, false 값이 1, 0으로 넘어온다.
                    ':DIGITAL_NAME_2CH' => $_POST['digitalName2ch'],
                    ':DIGITAL_MIN_VALUE_2CH' => $_POST['digitalMinValue2ch'],
                    ':DIGITAL_MAX_VALUE_2CH' => $_POST['digitalMaxValue2ch'],

                    ':SERIAL_IS_USE_1CH' => $_POST['serialIsUse1ch'], // true, false 값이 1, 0으로 넘어온다.
                    ':SERIAL_NAME_1CH' => $_POST['serialName1ch'],
                    ':SERIAL_PROTOCOL_1CH' => $_POST['serialProtocol1ch'],

                    ':BLUETOOTH_IS_USE_1CH' => $_POST['bluetoothIsUse1ch'], // true, false 값이 1, 0으로 넘어온다.
                    ':BLUETOOTH_NAME_1CH' => $_POST['bluetoothName1ch'],
                    // 해당 값은 마지막에 공백이 붙어서 넘어올 수 있다.
                    // 데이터 조회 API에서 JSON encoding시 숫자 자동 변환을 막기 위해 의도적으로 공백이 추가되기 때문이다.
                    ':BLUETOOTH_UUID_1CH' => trim($_POST['bluetoothUuid1ch'])
                ];

                $pdo->prepare($SQL_UPDATE_TB_TX_INFO)->execute($value);
            }

            $data['code'] = 0;
            $data['message'] = 'ok';

        } catch (Exception $e) {
            $data['message'] = $e->getMessage();
        }
    }

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>