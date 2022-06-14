<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav w-100">
                <li class="nav-item mr-3">
                    <a
                        :class="{active: pageName == 'device'}"
                        class="nav-link"
                        href="./device.php">

                        <span>Device</span>
                    </a>
                </li>

                <li class="nav-item mr-3">
                    <a
                        :class="{active: pageName == 'sensor'}"
                        class="nav-link"
                        href="./sensor.php">

                        <span>Sensor</span>
                    </a>
                </li>

                <li class="nav-item mr-3">
                    <a
                        :class="{active: pageName == 'monitoring'}"
                        class="nav-link"
                        href="./monitoring.php">

                        <span>Monitoring</span>
                    </a>
                </li>

                <li class="nav-item mr-3">
                    <a
                        :class="{active: pageName == 'serial-monitoring'}"
                        class="nav-link"
                        href="./serial-monitoring.php">

                        <span>Serial monitoring</span>
                    </a>
                </li>

                <li class="nav-item mr-3">
                    <a
                        :class="{active: pageName == 'system-log'}"
                        class="nav-link"
                        href="./system-log.php">

                        <span>System loging</span>
                    </a>
                </li>

                <li class="nav-item mr-lg-auto">
                    <a
                        :class="{active: pageName == 'setup'}"
                        class="nav-link"
                        href="./setup.php">

                        <span>Setup</span>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="https://github.com/11character/portfolio-device-setting-page">GitHub</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        props: {
            pageName: {type: String, default: ''}
        }
    }
</script>