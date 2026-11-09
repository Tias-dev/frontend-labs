export class ThemeSwitcher {
  private _current_theme: string;
  constructor(default_theme: string = "dark") {
    this._current_theme = default_theme;

    if (localStorage.getItem("theme") != null) {
      this._current_theme = localStorage.getItem("theme");
    }

    this.applyTheme();
  }

  applyTheme() {
    document.documentElement.classList.add(this._current_theme);
  }

  toogleTheme() {
    document.documentElement.classList.remove(this._current_theme);
    this._current_theme = this._current_theme == "dark" ? "light" : "dark";
    this.applyTheme();
  }
}
