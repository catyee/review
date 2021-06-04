1. 安装git之后 配置用户名和邮箱 git config --global user.name/user.email
2. git init 初始化git仓库
3. git add 添加到暂存区 git commit 提交到仓库 查看是否有未提交的 git status
4. 查看修改 git diff readme.text
5. git回退到上一版本：git reset --hard HEAD^   git回退到任一版本: git reset --hard 版本号    git log查看提交记录及版本号
   回退之后git log看不到最新的版本号  获取版本号 git reflog
6. git status 会提示 git checkout -- file 可以丢弃目前工作区的修改
    1. 修改了，没有git add 会撤销回到和版本库一模一样的状态
    2. 已经git add了，但是又作了修改，撤销修改回到添加暂存区的状态

  删除掉文件rm b.txt 也可以恢复 如果没有commit  恢复：git checkout -- b.txt  如果commit 不可以