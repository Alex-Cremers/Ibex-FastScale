# Ibex-FastScale
FastScale is a controller for the online psycholinguistic experiment platform Ibex. It is a variation of the Scale controller which allows participant to respond with only one mouse movement and click. A demo can be found [here](https://ibex.spellout.net/experiments/emmanuel/FastScale%20example/view).

**Important:** This controller is designed for use with a mouse or a trackpad. It works very poorly with touchscreens.

FastScale uses the following parameters:

Option | Default | Description
---|:-:|---|
html|*obligatory*|The HTML to display above the slider.
decimalPlaces|0|Number of decimals for the recorded value. Also affects how the extreme values and the handle label are displayed.
startValue|0|Lowest value on the scale.
endValue|100|Highest value on the scale.
scaleLabels|`null`|Labels to display on the left and right of the scale. Can be `null` (no label), the string `"numeric"` (displays startValue and endValue with decimalPlaces decimals), or an array with two elements giving the labels for the left and right of the scale as strings.
handleLabel|`false`|If true, the handle carries a numeric label indicating the value to be recorded.
startColor|`"#5947FD"`|Color at the left of the scale.
endColor|`"#59BAFD"`|Color at the right of the scale. If it differs from startColor, the scale shows a gradient.
scaleWidth|300|Width of the slider, in `px`.
scaleHeight|20|Height of the slider, in `px`.
handleWidth|30|Width of the handle, in `px`.
handleHeight|30|Height of the handle, in `px`.


The controller records the `html`, `startValue`, and `endValue` inputs, as well as `value`, which corresponds to the position where the participant moved the handle before clicking. `value` is recorded with `decimalPlaces` decimals.

**March 2021 update:** FastScale now passes the position of the handle to the next controller. If the next item is a FastScale too, its handle starts where it was in the previous item. This does not work if a Separator appears between the two (e.g., if using `sepWith()` in the shuffle sequence).
