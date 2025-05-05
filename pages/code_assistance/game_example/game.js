class SnakeGame {
    constructor() {
        this.gameArea = document.getElementById('game-area');
        this.startButton = document.getElementById('start-button');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.levelElement = document.getElementById('level');
        
        this.gridSize = 20;
        this.cellSize = this.gameArea.clientWidth / this.gridSize;
        this.snake = [];
        this.food = null;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.level = 1;
        this.baseSpeed = 200; // 基础速度（毫秒）
        this.speedIncrease = 5; // 每次吃到食物增加的速度
        this.currentSpeed = this.baseSpeed;
        this.gameInterval = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.celebrationContainer = document.querySelector('.celebration-container');

        // 关卡目标配置
        this.levelGoals = [
            { length: 5, description: "达到长度 5" },
            { length: 8, description: "达到长度 8" },
            { length: 12, description: "达到长度 12" },
            { length: 15, description: "达到长度 15" },
            { length: 20, description: "达到长度 20" }
        ];

        // 蛇的进化等级和称号
        this.evolutionLevels = [
            { length: 5, title: "炼体", color: "#34a853" },
            { length: 8, title: "筑基", color: "#1a73e8" },
            { length: 12, title: "金丹", color: "#9c27b0" },
            { length: 15, title: "元婴", color: "#ff9800" },
            { length: 20, title: "化神", color: "#f44336" }
        ];

        // 蛇头颜色渐变
        this.headColors = {
            base: "#1a73e8",
            evolution: "#ffd700"
        };

        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        this.highScoreElement.textContent = this.highScore;
    }

    startGame() {
        if (this.isPlaying) return;
        
        // 清除之前的庆祝效果
        this.celebrationContainer.innerHTML = '';
        document.querySelector('.game-container').classList.remove('celebration');
        
        this.isPlaying = true;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        this.currentSpeed = this.baseSpeed;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.startButton.disabled = true;
        
        // Initialize snake
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        
        this.createFood();
        this.updateDisplay();
        this.showLevelGoal();
        
        // Start game loop
        this.gameInterval = setInterval(() => this.gameLoop(), this.currentSpeed);
    }

    showLevelGoal() {
        const goal = this.levelGoals[this.level - 1];
        if (!goal) return;

        const goalMessage = document.createElement('div');
        goalMessage.className = 'level-goal';
        goalMessage.innerHTML = `
            <h3>关卡 ${this.level}</h3>
            <p>目标: ${goal.description}</p>
            <p>当前长度: ${this.snake.length}</p>
        `;
        this.gameArea.appendChild(goalMessage);
        setTimeout(() => goalMessage.remove(), 2000);
    }

    checkLevelComplete() {
        const goal = this.levelGoals[this.level - 1];
        if (!goal) return;

        if (this.snake.length >= goal.length) {
            // 显示关卡完成消息
            const levelComplete = document.createElement('div');
            levelComplete.className = 'level-complete';
            levelComplete.innerHTML = `
                <h3>关卡完成！</h3>
                <p>进入第 ${this.level + 1} 关</p>
            `;
            this.gameArea.appendChild(levelComplete);

            // 触发庆祝动画
            this.createConfetti();
            this.showCelebrationText(' ');
            this.showEvolutionText(this.snake.length);
            
            // 2秒后移除关卡完成消息
            setTimeout(() => {
                levelComplete.remove();
            }, 2000);

            // 进入下一关
            this.level++;
            this.levelElement.textContent = this.level;

            // 检查是否还有下一关
            if (this.level <= this.levelGoals.length) {
                setTimeout(() => this.showLevelGoal(), 2000);
            } else {
                // 所有关卡完成
                setTimeout(() => this.endGame(true), 2000);
            }
        }
    }

    handleKeyPress(event) {
        if (!this.isPlaying) return;

        if (event.code === 'Space') {
            this.togglePause();
            return;
        }

        if (this.isPaused) return;

        const key = event.key.toLowerCase();
        const currentDirection = this.direction;

        switch(key) {
            case 'arrowup':
            case 'w':
                if (currentDirection !== 'down') this.nextDirection = 'up';
                break;
            case 'arrowdown':
            case 's':
                if (currentDirection !== 'up') this.nextDirection = 'down';
                break;
            case 'arrowleft':
            case 'a':
                if (currentDirection !== 'right') this.nextDirection = 'left';
                break;
            case 'arrowright':
            case 'd':
                if (currentDirection !== 'left') this.nextDirection = 'right';
                break;
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            clearInterval(this.gameInterval);
            this.showPauseMessage();
        } else {
            this.gameInterval = setInterval(() => this.gameLoop(), this.currentSpeed);
            this.hidePauseMessage();
        }
    }

    showPauseMessage() {
        const pauseMessage = document.createElement('div');
        pauseMessage.className = 'game-over';
        pauseMessage.innerHTML = '<h2>游戏暂停</h2><p>按空格键继续</p>';
        this.gameArea.appendChild(pauseMessage);
    }

    hidePauseMessage() {
        const pauseMessage = this.gameArea.querySelector('.game-over');
        if (pauseMessage) pauseMessage.remove();
    }

    gameLoop() {
        if (this.isPaused) return;

        this.direction = this.nextDirection;
        const head = {...this.snake[0]};

        // Move head
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
            this.endGame(false);
            return;
        }

        // Check collision with self
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame(false);
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            
            // 增加速度
            this.currentSpeed = Math.max(50, this.currentSpeed - this.speedIncrease);
            clearInterval(this.gameInterval);
            this.gameInterval = setInterval(() => this.gameLoop(), this.currentSpeed);
            
            this.createFood();
            this.checkLevelComplete();
        } else {
            this.snake.pop();
        }

        this.updateDisplay();
    }

    createFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        this.food = newFood;
    }

    updateDisplay() {
        // Clear game area
        this.gameArea.innerHTML = '';
        
        const currentColor = this.getSnakeColor(this.snake.length);
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            const cell = document.createElement('div');
            cell.className = index === 0 ? 'snake-cell snake-head' : 'snake-cell';
            cell.style.gridColumn = segment.x + 1;
            cell.style.gridRow = segment.y + 1;
            
            // 设置颜色
            if (index === 0) {
                cell.style.backgroundColor = this.headColors.evolution;
            } else {
                cell.style.backgroundColor = currentColor;
            }
            
            this.gameArea.appendChild(cell);
        });
        
        // Draw food
        const foodCell = document.createElement('div');
        foodCell.className = 'food';
        foodCell.style.gridColumn = this.food.x + 1;
        foodCell.style.gridRow = this.food.y + 1;
        this.gameArea.appendChild(foodCell);

        // 显示当前关卡信息
        const goal = this.levelGoals[this.level - 1];
        if (goal) {
            const info = document.createElement('div');
            info.className = 'level-info';
            info.innerHTML = `
                <p>关卡 ${this.level}: ${goal.description}</p>
                <p>当前长度: ${this.snake.length}</p>
                <p>当前境界: ${this.getSnakeTitle(this.snake.length)}</p>
            `;
            this.gameArea.appendChild(info);
        }
    }

    createConfetti() {
        const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
        const shapes = ['square', 'circle', 'triangle'];
        
        for (let i = 0; i < 80; i++) { // 增加彩带数量
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random position
            confetti.style.left = Math.random() * 100 + 'vw';
            
            // Random color
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random shape
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.backgroundColor = 'transparent';
                confetti.style.borderLeft = '8px solid transparent';
                confetti.style.borderRight = '8px solid transparent';
                confetti.style.borderBottom = '15px solid ' + colors[Math.floor(Math.random() * colors.length)];
            }
            
            // Random size
            const size = Math.random() * 15 + 10; // 增加尺寸范围
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            
            // Random rotation
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Random animation duration
            confetti.style.animationDuration = (Math.random() * 2 + 3) + 's'; // 增加动画时长
            
            this.celebrationContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 6000);
        }
    }

    showCelebrationText(text) {
        const celebrationText = document.createElement('div');
        celebrationText.className = 'celebration-text';
        celebrationText.textContent = text;
        document.body.appendChild(celebrationText);
        
        // Remove text after animation
        setTimeout(() => {
            celebrationText.remove();
        }, 2000);
    }

    getSnakeColor(length) {
        for (let i = this.evolutionLevels.length - 1; i >= 0; i--) {
            if (length >= this.evolutionLevels[i].length) {
                return this.evolutionLevels[i].color;
            }
        }
        return this.evolutionLevels[0].color;
    }

    getSnakeTitle(length) {
        for (let i = this.evolutionLevels.length - 1; i >= 0; i--) {
            if (length >= this.evolutionLevels[i].length) {
                return this.evolutionLevels[i].title;
            }
        }
        return this.evolutionLevels[0].title;
    }

    showEvolutionText(length) {
        const title = this.getSnakeTitle(length);
        const evolutionText = document.createElement('div');
        evolutionText.className = 'evolution-text';
        evolutionText.textContent = `恭喜！你已进化为${title}蛇`;
        document.body.appendChild(evolutionText);
        
        setTimeout(() => {
            evolutionText.remove();
        }, 3000);
    }

    endGame(isVictory) {
        this.isPlaying = false;
        clearInterval(this.gameInterval);
        this.startButton.disabled = false;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.highScoreElement.textContent = this.highScore;
        }
        
        // Show game over message
        const gameOver = document.createElement('div');
        gameOver.className = 'game-over';
        gameOver.innerHTML = `
            <h2>${isVictory ? '恭喜通关！' : '游戏结束'}</h2>
            <p>最终得分: ${this.score}</p>
            <p>最高分: ${this.highScore}</p>
            <p>完成关卡: ${this.level - 1}</p>
            <p>蛇的长度: ${this.snake.length}</p>
            <p>最终境界: ${this.getSnakeTitle(this.snake.length)}</p>
        `;
        this.gameArea.appendChild(gameOver);

        // 如果是最终通关，显示更盛大的庆祝动画
        if (isVictory) {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    this.createConfetti();
                    this.showCelebrationText('完美通关！');
                    this.showEvolutionText(this.snake.length);
                }, i * 1000);
            }
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new SnakeGame();
}); 