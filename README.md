# ss-vis-component
VIS components for a security system, to monitor the state and confirm the system's health running.

## Introduction

This is a demo project of my work about how to visualize charts with pure d3. Current pages are loaded from one js file `integrateIndex.js`, all initialize, update and fake data generating methods are included. 

Each type of chart include `generate` and `redraw` methods, all 11 types of charts are defined in `methods` of Vue defining part. I will extract them out and then explain them briefly if someone are interested in this work.
 
## Remaining BUGS
When some extra dots in charts (line chart / area chart) are removed from the svg, the tooltips of remaining dots seems to point false info in its secondary dot (Two dots will exist in one x-axis, such as the write and read dots in charts. For the development of showing different dots' tooltip, we call one dot is chief one while another's secondary). I found it is the updating codes' running order in d3 that causes the problem. Since I am now busy with other thing, I will not fix the display bugs in time, but it's welcomed for you to report the fixing methods.

Joe Jiang
2015.10
