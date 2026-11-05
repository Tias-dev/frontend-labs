import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div>Ниже канвас</div>
<canvas id="main_canvas"><canvas/>
<div>Выше канвас</div>
`
