$(function() {

  var text,
      patternBold,
      patternItalic,
      styleMap,
      boldStyle = {'font-weight':'bold'},
      italicStyle = {'font-style':'italic'};

  // fire whenever inputs change
  $('#enter-text, #bold-pattern, #italic-pattern').on('input', function() {
    // update model values
    text = $('#enter-text').val();
    patternBold = $('#bold-pattern').val();
    patternItalic = $('#italic-pattern').val();

    // reset style map and store a function to produce the correct styled span with a case-insensitive match
    styleMap = {};
    if (patternBold) {
      styleMap[patternBold.toLowerCase()] = function(match) {
        return wrapStyleSpan(match, boldStyle);
      };
    }
    if (patternItalic) {
      styleMap[patternItalic.toLowerCase()] = function(match) {
        return wrapStyleSpan(match, italicStyle);
      };
    }

    $('.display-area').text(text ? text : 'Text will be displayed here...');

    // only run the replace if there are patterns to search for
    if (patternBold || patternItalic) {
      $('.display-area').html(regexReplace(text, styleMap));
    }

  });

});

// split and join method - case sensitive, breaks when pattern includes html entities
function splitJoin(pattern, text, style) {
  styleString = wrapStyleSpan(pattern, style);

  return text.split(pattern).join(styleString);
}

// regex string replace method
function regexReplace(text, styleMap) {
  // build a regex string to match any of the patterns in styleMap
  var pattern = '';
  for (var prop in styleMap) {
    pattern += prop + '|';
  }
  pattern = pattern.slice(0, -1);

  return text.replace(new RegExp(pattern, 'gi'), function($0) {
    var match = $0.toLowerCase();
    return styleMap[match]($0) || $0;
  });
}

// helper method to wrap text in style span
function wrapStyleSpan(pattern, style) {
  var styleString = '<span style="';
  for(var prop in style) {
    styleString += prop + ':' + style[prop] + ';';
  }
  return styleString += '">' + pattern + '</span>';
}


/*To do:
- handle overlapping matches
  - tweak regex
  - find another way to apply styles without overlapping spans?
- let user toggle case sensitivity
- Boyer-Moore method
*/
