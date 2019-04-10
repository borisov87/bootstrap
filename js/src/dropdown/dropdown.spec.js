import Dropdown from './dropdown'
import Popper from 'popper.js'

/** Test helpers */
import { getFixture, clearFixture, createEvent } from '../../tests/helpers/fixture'

describe('Dropdown', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Dropdown.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Dropdown.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('DefaultType', () => {
    it('should return plugin default type config', () => {
      expect(Dropdown.DefaultType).toEqual(jasmine.any(Object))
    })
  })

  describe('constructor', () => {
    it('should create offset modifier correctly when offset option is a function', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const getOffset = offsets => offsets
      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown, {
        offset: getOffset
      })

      const offset = dropdown._getOffset()

      expect(offset.offset).toBeUndefined()
      expect(typeof offset.fn).toEqual('function')
    })

    it('should create offset modifier correctly when offset option is not a function', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const myOffset = 7
      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown, {
        offset: myOffset
      })

      const offset = dropdown._getOffset()

      expect(offset.offset).toEqual(myOffset)
      expect(offset.fn).toBeUndefined()
    })

    it('should add a listener on trigger which do not have data-toggle="dropdown"', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('.btn')
      const dropdown = new Dropdown(btnDropdown)

      spyOn(dropdown, 'toggle')

      btnDropdown.click()

      expect(dropdown.toggle).toHaveBeenCalled()
    })
  })

  describe('toggle', () => {
    it('should toggle a dropdown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownEl.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        done()
      })

      dropdown.toggle()
    })

    it('should not toggle a dropdown if the element is disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.toggle()

      setTimeout(() => {
        expect().nothing()
        done()
      })
    })

    it('should not toggle a dropdown if the element contains .disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.toggle()

      setTimeout(() => {
        expect().nothing()
        done()
      })
    })

    it('should not toggle a dropdown if the menu is shown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.toggle()

      setTimeout(() => {
        expect().nothing()
        done()
      })
    })

    it('should not toggle a dropdown if show event is prevented', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('show.bs.dropdown', e => {
        e.preventDefault()
      })

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.toggle()

      setTimeout(() => {
        expect().nothing()
        done()
      })
    })
  })

  describe('show', () => {
    it('should show a dropdown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownEl.classList.contains('show')).toEqual(true)
        done()
      })

      dropdown.show()
    })

    it('should not show a dropdown if the element is disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.show()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })

    it('should not show a dropdown if the element contains .disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.show()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })

    it('should not show a dropdown if the menu is shown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.show()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })

    it('should not show a dropdown if show event is prevented', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('show.bs.dropdown', e => {
        e.preventDefault()
      })

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        throw new Error('should not throw shown.bs.dropdown event')
      })

      dropdown.show()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })
  })

  describe('hide', () => {
    it('should hide a dropdown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        expect(dropdownMenu.classList.contains('show')).toEqual(false)
        done()
      })

      dropdown.hide()
    })

    it('should not hide a dropdown if the element is disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        throw new Error('should not throw hidden.bs.dropdown event')
      })

      dropdown.hide()

      setTimeout(() => {
        expect(dropdownMenu.classList.contains('show')).toEqual(true)
        done()
      }, 10)
    })

    it('should not hide a dropdown if the element contains .disabled', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        throw new Error('should not throw hidden.bs.dropdown event')
      })

      dropdown.hide()

      setTimeout(() => {
        expect(dropdownMenu.classList.contains('show')).toEqual(true)
        done()
      }, 10)
    })

    it('should not hide a dropdown if the menu is not shown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        throw new Error('should not throw hidden.bs.dropdown event')
      })

      dropdown.hide()

      setTimeout(() => {
        expect().nothing()
        done()
      }, 10)
    })

    it('should not hide a dropdown if hide event is prevented', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu show">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')
      const dropdown = new Dropdown(btnDropdown)

      dropdownEl.addEventListener('hide.bs.dropdown', e => {
        e.preventDefault()
      })

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        throw new Error('should not throw hidden.bs.dropdown event')
      })

      dropdown.hide()

      setTimeout(() => {
        expect(dropdownMenu.classList.contains('show')).toEqual(true)
        done()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose dropdown', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      expect(dropdown._popper).toBeNull()
      expect(dropdown._menu).toBeDefined()
      expect(dropdown._element).toBeDefined()

      dropdown.dispose()

      expect(dropdown._menu).toBeNull()
      expect(dropdown._element).toBeNull()
    })

    it('should dispose dropdown with popper.js', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      dropdown.toggle()

      expect(dropdown._popper).toBeDefined()
      expect(dropdown._menu).toBeDefined()
      expect(dropdown._element).toBeDefined()

      spyOn(Popper.prototype, 'destroy')

      dropdown.dispose()

      expect(dropdown._popper).toBeNull()
      expect(dropdown._menu).toBeNull()
      expect(dropdown._element).toBeNull()
      expect(Popper.prototype.destroy).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should call popper.js and detect navbar on update', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      dropdown.toggle()

      expect(dropdown._popper).toBeDefined()

      spyOn(dropdown._popper, 'scheduleUpdate')
      spyOn(dropdown, '_detectNavbar')

      dropdown.update()

      expect(dropdown._popper.scheduleUpdate).toHaveBeenCalled()
      expect(dropdown._detectNavbar).toHaveBeenCalled()
    })

    it('should just detect navbar on update', () => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = new Dropdown(btnDropdown)

      spyOn(dropdown, '_detectNavbar')

      dropdown.update()

      expect(dropdown._popper).toBeNull()
      expect(dropdown._detectNavbar).toHaveBeenCalled()
    })
  })

  describe('data-api', () => {
    it('should not add class position-static to dropdown if boundary not set', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownEl.classList.contains('position-static')).toEqual(false)
        done()
      })

      btnDropdown.click()
    })

    it('should add class position-static to dropdown if boundary not scrollParent', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown" data-boundary="viewport">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownEl.classList.contains('position-static')).toEqual(true)
        done()
      })

      btnDropdown.click()
    })

    it('should show and hide a dropdown', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      let showEventTriggered = false
      let hideEventTriggered = false

      dropdownEl.addEventListener('show.bs.dropdown', () => {
        showEventTriggered = true
      })

      dropdownEl.addEventListener('shown.bs.dropdown', e => {
        expect(dropdownEl.classList.contains('show')).toEqual(true)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('true')
        expect(showEventTriggered).toEqual(true)
        expect(e.relatedTarget).toEqual(btnDropdown)
        document.body.click()
      })

      dropdownEl.addEventListener('hide.bs.dropdown', () => {
        hideEventTriggered = true
      })

      dropdownEl.addEventListener('hidden.bs.dropdown', e => {
        expect(dropdownEl.classList.contains('show')).toEqual(false)
        expect(btnDropdown.getAttribute('aria-expanded')).toEqual('false')
        expect(hideEventTriggered).toEqual(true)
        expect(e.relatedTarget).toEqual(btnDropdown)
        done()
      })

      btnDropdown.click()
    })

    it('should not use popper.js in navbar', done => {
      fixtureEl.innerHTML = [
        '<nav class="navbar navbar-expand-md navbar-light bg-light">',
        '  <div class="dropdown">',
        '    <button href="#" class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Dropdown</button>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item" href="#">Secondary link</a>',
        '    </div>',
        '  </div>',
        '</nav>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownMenu.getAttribute('style')).toEqual(null, 'no inline style applied by popper.js')
        done()
      })

      btnDropdown.click()
    })

    it('should not use popper.js if display set to static', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown" data-display="static">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')
      const dropdownMenu = fixtureEl.querySelector('.dropdown-menu')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        // popper.js add this attribute when we use it
        expect(dropdownMenu.getAttribute('x-placement')).toEqual(null)
        done()
      })

      btnDropdown.click()
    })

    it('should remove "show" class if tabbing outside of menu', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Secondary link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const btnDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdownEl = fixtureEl.querySelector('.dropdown')

      dropdownEl.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownEl.classList.contains('show')).toEqual(true)

        const keyUp = createEvent('keyup')

        keyUp.which = 9 // Tab
        document.dispatchEvent(keyUp)
      })

      dropdownEl.addEventListener('hidden.bs.dropdown', () => {
        expect(dropdownEl.classList.contains('show')).toEqual(false)
        done()
      })

      btnDropdown.click()
    })

    it('should remove "show" class if body is clicked, with multiple dropdowns', done => {
      fixtureEl.innerHTML = [
        '<div class="nav">',
        '  <div class="dropdown" id="testmenu">',
        '    <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu <span class="caret"/></a>',
        '    <div class="dropdown-menu">',
        '      <a class="dropdown-item" href="#sub1">Submenu 1</a>',
        '    </div>',
        '  </div>',
        '</div>',
        '<div class="btn-group">',
        '  <button class="btn">Actions</button>',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown"></button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Action 1</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdownList = fixtureEl.querySelectorAll('[data-toggle="dropdown"]')

      expect(triggerDropdownList.length).toEqual(2)

      const first = triggerDropdownList[0]
      const last = triggerDropdownList[1]
      const dropdownTestMenu = first.parentNode
      const btnGroup = last.parentNode

      dropdownTestMenu.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownTestMenu.classList.contains('show')).toEqual(true)
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(1)
        document.body.click()
      })

      dropdownTestMenu.addEventListener('hidden.bs.dropdown', () => {
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(0)
        last.click()
      })

      btnGroup.addEventListener('shown.bs.dropdown', () => {
        expect(btnGroup.classList.contains('show')).toEqual(true)
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(1)
        document.body.click()
      })

      btnGroup.addEventListener('hidden.bs.dropdown', () => {
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(0)
        done()
      })

      first.click()
    })

    it('should remove "show" class if body if tabbing outside of menu, with multiple dropdowns', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <a class="dropdown-toggle" data-toggle="dropdown" href="#testmenu">Test menu</a>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
        '  </div>',
        '</div>',
        '<div class="btn-group">',
        '  <button class="btn">Actions</button>',
        '  <button class="btn dropdown-toggle" data-toggle="dropdown"></button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#">Action 1</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdownList = fixtureEl.querySelectorAll('[data-toggle="dropdown"]')

      expect(triggerDropdownList.length).toEqual(2)

      const first = triggerDropdownList[0]
      const last = triggerDropdownList[1]
      const dropdownTestMenu = first.parentNode
      const btnGroup = last.parentNode

      dropdownTestMenu.addEventListener('shown.bs.dropdown', () => {
        expect(dropdownTestMenu.classList.contains('show')).toEqual(true, '"show" class added on click')
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(1, 'only one dropdown is shown')

        const keyUp = createEvent('keyup')
        keyUp.which = 9 // Tab

        document.dispatchEvent(keyUp)
      })

      dropdownTestMenu.addEventListener('hidden.bs.dropdown', () => {
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(0, '"show" class removed')
        last.click()
      })

      btnGroup.addEventListener('shown.bs.dropdown', () => {
        expect(btnGroup.classList.contains('show')).toEqual(true, '"show" class added on click')
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(1, 'only one dropdown is shown')

        const keyUp = createEvent('keyup')
        keyUp.which = 9 // Tab

        document.dispatchEvent(keyUp)
      })

      btnGroup.addEventListener('hidden.bs.dropdown', () => {
        expect(fixtureEl.querySelectorAll('.dropdown-menu.show').length).toEqual(0, '"show" class removed')
        done()
      })

      first.click()
    })

    it('should fire hide and hidden event without a clickEvent if event type is not click', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')

      dropdown.addEventListener('hide.bs.dropdown', e => {
        expect(e.clickEvent).toBeUndefined()
      })

      dropdown.addEventListener('hidden.bs.dropdown', e => {
        expect(e.clickEvent).toBeUndefined()
        done()
      })

      dropdown.addEventListener('shown.bs.dropdown', () => {
        const keyDown = createEvent('keydown')

        keyDown.which = 27
        triggerDropdown.dispatchEvent(keyDown)
      })

      triggerDropdown.click()
    })

    it('should ignore keyboard events within <input>s and <textarea>s', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item" href="#sub1">Submenu 1</a>',
        '    <input type="text" />',
        '    <textarea></textarea>',
        '  </div>',
        '</div>'
      ].join('')

      // the element must be displayed, without that activeElement won't change
      fixtureEl.style.display = 'block'

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')
      const input = fixtureEl.querySelector('input')
      const textarea = fixtureEl.querySelector('textarea')

      dropdown.addEventListener('shown.bs.dropdown', () => {
        input.focus()
        const keyDown = createEvent('keydown')

        keyDown.which = 38
        input.dispatchEvent(keyDown)

        expect(document.activeElement).toEqual(input, 'input still focused')

        textarea.focus()
        textarea.dispatchEvent(keyDown)

        expect(document.activeElement).toEqual(textarea, 'textarea still focused')
        fixtureEl.style.display = 'none'
        done()
      })

      triggerDropdown.click()
    })

    it('should skip disabled element when using keyboard navigation', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a class="dropdown-item disabled" href="#sub1">Submenu 1</a>',
        '    <button class="dropdown-item" type="button" disabled>Disabled button</button>',
        '    <a id="item1" class="dropdown-item" href="#">Another link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')

      // the element must be displayed, without that activeElement won't change
      fixtureEl.style.display = 'block'

      dropdown.addEventListener('shown.bs.dropdown', () => {
        const keyDown = createEvent('keydown')
        keyDown.which = 40

        triggerDropdown.dispatchEvent(keyDown)
        triggerDropdown.dispatchEvent(keyDown)

        expect(document.activeElement.classList.contains('disabled')).toEqual(false, '.disabled not focused')
        expect(document.activeElement.hasAttribute('disabled')).toEqual(false, ':disabled not focused')
        fixtureEl.style.display = 'none'
        done()
      })

      triggerDropdown.click()
    })

    it('should focus next/previous element when using keyboard navigation', done => {
      fixtureEl.innerHTML = [
        '<div class="dropdown">',
        '  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>',
        '  <div class="dropdown-menu">',
        '    <a id="item1" class="dropdown-item" href="#">A link</a>',
        '    <a id="item2" class="dropdown-item" href="#">Another link</a>',
        '  </div>',
        '</div>'
      ].join('')

      const triggerDropdown = fixtureEl.querySelector('[data-toggle="dropdown"]')
      const dropdown = fixtureEl.querySelector('.dropdown')
      const item1 = fixtureEl.querySelector('#item1')
      const item2 = fixtureEl.querySelector('#item2')

      // the element must be displayed, without that activeElement won't change
      fixtureEl.style.display = 'block'

      dropdown.addEventListener('shown.bs.dropdown', () => {
        const keyDown40 = createEvent('keydown')
        keyDown40.which = 40

        triggerDropdown.dispatchEvent(keyDown40)
        expect(document.activeElement).toEqual(item1, 'item1 is focused')

        document.activeElement.dispatchEvent(keyDown40)
        expect(document.activeElement).toEqual(item2, 'item2 is focused')

        const keyDown38 = createEvent('keydown')
        keyDown38.which = 38

        document.activeElement.dispatchEvent(keyDown38)
        expect(document.activeElement).toEqual(item1, 'item1 is focused')

        fixtureEl.style.display = 'none'
        done()
      })

      triggerDropdown.click()
    })
  })
})
