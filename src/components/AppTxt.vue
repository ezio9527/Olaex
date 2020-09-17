<template>
    <div class="terminal">
        <div>
            <el-dropdown>
                <div class="el-dropdown-link">
                    <img src="../assets/android.png" alt="" />
                    <p>Android</p>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <img class="qrcode" src="../assets/download_android.png" />
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div>
            <el-dropdown>
                <div class="el-dropdown-link">
                    <img src="../assets/ios.png" alt="" />
                    <p>IOS</p>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <img class="qrcode"  src="../assets/download_ios.png" />
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<style lang="less">
.terminal{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;
    width: 180px;
    margin: 40px auto 0 auto;
}
</style>
