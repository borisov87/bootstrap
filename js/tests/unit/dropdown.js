$(function () {
  'use strict'

  QUnit.module('dropdowns plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).dropdown, 'dropdown method is defined')
  })

  QUnit.module('dropdowns', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapDropdown = $.fn.dropdown.noConflict()
    },
    afterEach: function () {
      $.fn.dropdown = $.fn.bootstrapDropdown
      delete $.fn.bootstrapDropdown
      $('#qunit-fixture').html('')
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.dropdown, 'undefined', 'dropdown was set back to undefined (org value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.appendTo('#qunit-fixture')
    $el.bootstrapDropdown()
    try {
      $el.bootstrapDropdown('noMethod')
    } catch (error) {
      assert.strictEqual(error.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    $el.appendTo('#qunit-fixture')
    var $dropdown = $el.bootstrapDropdown()
    assert.ok($dropdown instanceof $, 'returns jquery collection')
    assert.strictEqual($dropdown[0], $el[0], 'collection contains element')
  })

  QUnit.test('should not close the dropdown if the user clicks on a text field', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var dropdownHTML = '<div class="dropdown">' +
        '<button type="button" data-toggle="dropdown">Dropdown</button>' +
        '<div class="dropdown-menu">' +
        '<input id="textField" type="text" />' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()

    var $textfield = $('#textField')
    $textfield.on('click', function () {
      assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
      done()
    })

    $dropdown
      .parent('.dropdown')
      .on('shown.bs.dropdown', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        $textfield[0].dispatchEvent(new Event('click'))
      })
    $dropdown[0].dispatchEvent(new Event('click'))
  })

  QUnit.test('should not close the dropdown if the user clicks on a textarea', function (assert) {
    assert.expect(2)
    var done = assert.async()
    var dropdownHTML = '<div class="dropdown">' +
        '<button type="button" data-toggle="dropdown">Dropdown</button>' +
        '<div class="dropdown-menu">' +
        '<textarea id="textArea"></textarea>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()

    var $textarea = $('#textArea')
    $textarea.on('click', function () {
      assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
      done()
    })

    $dropdown
      .parent('.dropdown')
      .on('shown.bs.dropdown', function () {
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        $textarea[0].dispatchEvent(new Event('click'))
      })
    $dropdown[0].dispatchEvent(new Event('click'))
  })

  QUnit.test('should ignore keyboard events for <input>s and <textarea>s within dropdown-menu, except for escape key', function (assert) {
    assert.expect(7)
    var done = assert.async()

    var dropdownHTML = '<div class="tabs">' +
        '<div class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Secondary link</a>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '<div class="divider"/>' +
        '<a class="dropdown-item" href="#">Another link</a>' +
        '<input type="text" id="input">' +
        '<textarea id="textarea"/>' +
        '</div>' +
        '</div>' +
        '</div>'
    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()

    var $input = $('#input')
    var $textarea = $('#textarea')

    $dropdown
      .parent('.dropdown')
      .on('shown.bs.dropdown', function () {
        // Space key
        $input.trigger('focus').trigger($.Event('keydown', {
          which: 32
        }))
        assert.ok($(document.activeElement)[0] === $input[0], 'input still focused')
        $textarea.trigger('focus').trigger($.Event('keydown', {
          which: 32
        }))
        assert.ok($(document.activeElement)[0] === $textarea[0], 'textarea still focused')

        // Key up
        $input.trigger('focus').trigger($.Event('keydown', {
          which: 38
        }))
        assert.ok($(document.activeElement)[0] === $input[0], 'input still focused')
        $textarea.trigger('focus').trigger($.Event('keydown', {
          which: 38
        }))
        assert.ok($(document.activeElement)[0] === $textarea[0], 'textarea still focused')

        // Key down
        $input.trigger('focus').trigger($.Event('keydown', {
          which: 40
        }))
        assert.ok($(document.activeElement)[0] === $input[0], 'input still focused')
        $textarea.trigger('focus').trigger($.Event('keydown', {
          which: 40
        }))
        assert.ok($(document.activeElement)[0] === $textarea[0], 'textarea still focused')

        // Key escape
        $input.trigger('focus')
        var keydown = new Event('keydown')
        keydown.which = 27
        $input[0].dispatchEvent(keydown)

        assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is not shown')
        done()
      })

    $dropdown[0].dispatchEvent(new Event('click'))
  })

  QUnit.test('should ignore space key events for <input>s within dropdown, and accept up, down and escape', function (assert) {
    assert.expect(7)
    var done = assert.async()

    var dropdownHTML =
        '<ul class="nav tabs">' +
        '  <li class="dropdown">' +
        '    <input type="text" id="input" data-toggle="dropdown">' +
        '    <div class="dropdown-menu" role="menu">' +
        '      <a id="item1" class="dropdown-item" href="#">Secondary link</a>' +
        '      <a id="item2" class="dropdown-item" href="#">Something else here</a>' +
        '      <div class="divider"></div>' +
        '      <a class="dropdown-item" href="#">Another link</a>' +
        '    </div>' +
        '  </li>' +
        '</ul>'

    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()

    var $input = $('#input')

    $dropdown
      .parent('.dropdown')
      .one('shown.bs.dropdown', function () {
        assert.ok(true, 'shown was fired')

        // Key space
        $input.trigger('focus').trigger($.Event('keydown', {
          which: 32
        }))
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        assert.ok($(document.activeElement).is($input), 'input is still focused')

        // Key escape
        $input.trigger('focus')
        var keydown = new Event('keydown')
        keydown.which = 27
        $input[0].dispatchEvent(keydown)
        assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is not shown')

        $dropdown
          .parent('.dropdown')
          .one('shown.bs.dropdown', function () {
            assert.ok(true, 'shown was fired')

            // Key down
            $input.trigger('focus')
            var keydown40 = new Event('keydown')
            keydown40.which = 40
            $input[0].dispatchEvent(keydown40)
            assert.ok(document.activeElement === $('#item1')[0], 'item1 is focused')

            $dropdown
              .parent('.dropdown')
              .one('shown.bs.dropdown', function () {
                // Key up
                $input.trigger('focus')
                var keydown38 = new Event('keydown')
                keydown38.which = 38
                $input[0].dispatchEvent(keydown38)

                assert.ok(document.activeElement === $('#item1')[0], 'item1 is focused')
                done()
              })
              .bootstrapDropdown('toggle')

            $input.bootstrapDropdown('toggle')
          })

        $input.bootstrapDropdown('toggle')
      })

    $input[0].dispatchEvent(new Event('click'))
  })

  QUnit.test('should ignore space key events for <textarea>s within dropdown, and accept up, down and escape', function (assert) {
    assert.expect(7)
    var done = assert.async()

    var dropdownHTML =
        '<ul class="nav tabs">' +
        '  <li class="dropdown">' +
        '    <textarea id="textarea" data-toggle="dropdown"></textarea>' +
        '    <div class="dropdown-menu" role="menu">' +
        '      <a id="item1" class="dropdown-item" href="#">Secondary link</a>' +
        '      <a id="item2" class="dropdown-item" href="#">Something else here</a>' +
        '      <div class="divider"></div>' +
        '      <a class="dropdown-item" href="#">Another link</a>' +
        '    </div>' +
        '  </li>' +
        '</ul>'

    var $dropdown = $(dropdownHTML)
      .appendTo('#qunit-fixture')
      .find('[data-toggle="dropdown"]')
      .bootstrapDropdown()

    var $textarea = $('#textarea')

    $dropdown
      .parent('.dropdown')
      .one('shown.bs.dropdown', function () {
        assert.ok(true, 'shown was fired')

        // Key space
        $textarea.trigger('focus').trigger($.Event('keydown', {
          which: 32
        }))
        assert.ok($dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is shown')
        assert.ok($(document.activeElement).is($textarea), 'textarea is still focused')

        // Key escape
        $textarea.trigger('focus')
        var keydown27 = new Event('keydown')
        keydown27.which = 27
        $textarea[0].dispatchEvent(keydown27)
        assert.ok(!$dropdown.parent('.dropdown').hasClass('show'), 'dropdown menu is not shown')

        $dropdown
          .parent('.dropdown')
          .one('shown.bs.dropdown', function () {
            assert.ok(true, 'shown was fired')

            // Key down
            $textarea.trigger('focus')
            var keydown40 = new Event('keydown')
            keydown40.which = 40
            $textarea[0].dispatchEvent(keydown40)
            assert.ok(document.activeElement === $('#item1')[0], 'item1 is focused')

            $dropdown
              .parent('.dropdown')
              .one('shown.bs.dropdown', function () {
                // Key up
                $textarea.trigger('focus')
                var keydown38 = new Event('keydown')
                keydown38.which = 38
                $textarea[0].dispatchEvent(keydown38)

                assert.ok(document.activeElement === $('#item1')[0], 'item1 is focused')
                done()
              })
              .bootstrapDropdown('toggle')

            $textarea.bootstrapDropdown('toggle')
          })

        $textarea.bootstrapDropdown('toggle')
      })
    $textarea[0].dispatchEvent(new Event('click'))
  })
})
