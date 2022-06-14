<?php
    include './api-login-check.php';
    include '../config-db.php';

    $data = [
        'code' => 99,
        'message' => 'data not found.'
    ];

    $bool = isset($_POST['number']) && $_POST['number'] > -1;
    $bool = $bool && isset($_POST['analogName1ch']) && trim($_POST['analogName1ch']);
    $bool = $bool && isset($_POST['analogName2ch']) && trim($_POST['analogName2ch']);
    $bool = $bool && isset($_POST['digitalName1ch']) && trim($_POST['digitalName1ch']);
    $bool = $bool && isset($_POST['digitalName2ch']) && trim($_POST['digitalName2ch']);

    if ($bool) {
        try {
            $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
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
                ':BLUETOOTH_UUID_1CH' => $_POST['bluetoothUuid1ch']
            ];

            $pdo->prepare($SQL_INSERT_TB_TX_INFO)->execute($value);

            $data['code'] = 0;
            $data['message'] = 'ok';

        } catch (Exception $e) {
            $data['message'] = $e->getMessage();
        }
    }

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>