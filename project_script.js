const sections = [
    {
        title: "项目背景与目标",
        content: `
            <p>2023年，市场环境继续发生着深刻的变化。美的有效贯彻"稳定盈利，驱动增长"的年度经营原则，坚持在漫长的周期里做确定的事情，书写了历史上最好的经营业绩。</p>
            <p class="quote">美的必须告别上一个周期，告别过去的思维模式，自我反思、自我否定，内心要更加坚韧，行动要更加坚决。</p>
            <h3>项目目标：</h3>
            <ul>
                <li>系统学习理论及规律、补充完善知识结构，实现团队的管理赋能、领导赋能。</li>
                <li>激活学习力、打造学习型团队，助力实现绩效业务目标。</li>
                <li>培养系统思考力、推动变革实践和创造性解决复杂问题的能力。</li>
            </ul>
            <p class="quote">学习新知 赋能团队 创造价值</p>
        `,
        icon: "🌟"
    },
    {
        title: "项目设计理念",
        content: `
            <div class="grid">
                <div class="grid-item">
                    <h3>服务企业战略</h3>
                    <p>支持企业人才战略发展需要，成为企业战略性合作伙伴。</p>
                </div>
                <div class="grid-item">
                    <h3>引领创新发展</h3>
                    <p>发挥清华学科与师资优势，助力洞察未来、创新发展。</p>
                </div>
                <div class="grid-item">
                    <h3>系统设计方案</h3>
                    <p>定制人才培养整体方案，系统设计学习价值链各个环节。</p>
                </div>
                <div class="grid-item">
                    <h3>促动学用成长</h3>
                    <p>强化教学沟通、学用结合，提升解决实际问题能力。</p>
                </div>
            </div>
            <p class="quote">基于6D法则的学习项目设计与实施，推动学用转化的有效性。</p>
        `,
        icon: "💡"
    },
    {
        title: "人才分类培养规划",
        content: `
            <p>按照党的二十届三中全会提出的要求，结合美的集团发展确定"压舱石"和"突破口"的战略部署，针对美的全球化科技集团整体人才培养需要"分类分级"的指导思想，整体学习建议覆盖三类人才学习计划：</p>
            <ul>
                <li>高层管理人才序列</li>
                <li>科技拔尖人才序列</li>
                <li>国际化人才序列</li>
            </ul>
            <p class="quote">着力培养"明大势、善管理、敢担当"的高层管理人才；着力培养"全球视野、前瞻眼光、跨国经营"的国际化人才；着力培养具有"创新能力、技术领先、系统思维"的科技人才。</p>
        `,
        icon: "👥"
    },
    {
        title: "学习体系",
        content: `
            <p>按照清华大学"价值塑造、能力培养、知识传授"三位一体的教育理念和人才培养模式，我们为美的集团高层管理者量身定做全面提升管理能力、领导能力、管理者素养和格局并符合其自身发展的系列课程。</p>
            <h3>核心能力：</h3>
            <ul>
                <li>管理逻辑与变革思维</li>
                <li>领导逻辑与团队思维</li>
                <li>宏观逻辑与战略思维</li>
                <li>内化逻辑与实践思维</li>
                <li>运营逻辑与提效思维</li>
            </ul>
            <p class="quote">把控多维大环境，应对经营管理复杂性，提升领导力与创新思维，推进产融进阶与数智化转型。</p>
        `,
        icon: "📚"
    },
    {
        title: "项目实施及运营",
        content: `
            <h3>项目总体推进计划和路径图：</h3>
            <ol>
                <li>项目调研</li>
                <li>项目立项</li>
                <li>需求分析与诊断</li>
                <li>项目方案设计</li>
                <li>协议签署</li>
                <li>项目实施前期筹备</li>
                <li>项目实施</li>
                <li>项目评估</li>
            </ol>
            <p class="quote">从项目调研到最终评估，我们将全程陪伴，确保项目的顺利实施和最佳效果。</p>
        `,
        icon: "🚀"
    },
    {
        title: "项目结果及评估",
        content: `
            <p>企业、学员、教师、项目团队共同对课程、师资、教学管理、项目管理进行全方位评估，同时在课程中根据需要加入课程考核、课题答辩等环节以强化或检验学习效果。</p>
            <h3>评估方式：</h3>
            <ul>
                <li>学员满意度</li>
                <li>知识技能掌握度</li>
                <li>行为改变</li>
                <li>业绩改善</li>
            </ul>
            <p class="quote">根据项目需求设计实施柯氏一级到四级评估，确保学习效果的全面评估与持续改进。</p>
        `,
        icon: "📊"
    }
];

function createCard(section, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <span class="card-icon">${section.icon}</span>
            <h2 class="card-title">${section.title}</h2>
        </div>
        <div class="card-content">
            ${section.content}
        </div>
    `;
    setTimeout(() => card.classList.add('show'), 100 * index);
    return card;
}

const cardContainer = document.getElementById('cardContainer');
sections.forEach((section, index) => {
    cardContainer.appendChild(createCard(section, index));
});