var app = (function () {
		'use strict';
		
		var builder = {
			createTable: function (stdIn, doc, preLoader, appCnt) {
				var data = stdIn.value,
					struct = data.split(/\n+/).map(function (elem) { return elem.split(/,|, /); }),
					table = '<table class="u-full-width"><thead>',
					indicateProgress = this.indicateProgress.bind(this, preLoader);
					
				for (var i = 0, j = 0, len = struct.length, len_head = struct[0].length; i < len; i += 1) {
					table += '<tr>';
					while (j < len_head) {
						i || (table += '<th>' + struct[i][j] + '</th>');
						i && (table += '<td>' + struct[i][j] + '</td>');
						j += 1;
					}
					table += '<tr>';
					i || (table += '</thead><tbody>');
					j = 0;
				}
				
				table += '</tbody></table>';
				
				indicateProgress();
				
				setTimeout(function () {
					indicateProgress();
					appCnt.removeChild(appCnt.lastChild);
					appCnt.insertAdjacentHTML('beforeEnd', table);
				}, 2e3);
			},
			indicateProgress: function (preLoader) {
				preLoader.classList.toggle('__hidden');
			},
			validateData: function () {
				// TODO: Validation is strongly required.
			},
			sortData: function (struct, spec /* Use form: { 'name': 'desc' } */) {
				var columnData = struct.slice(1).map(function (elem) { return elem[0]; });
				
				switch (spec[Object.keys(spec)[0]]) {
					case 'txt':
						columnData = spec.txt === 'desc' ? columnData.sort().reverse() : columnData.sort() /* if 'asc' */;
						break;
					case 'num':
						columnData = spec.num === 'desc' ? columnData.sort(function (a, b) { return b - a; /* Not b > a -- prevents bug in Chrome */})
														 : columnData.sort(function (a, b) { return a - b; });
						break;
					case 'date':
						columnData = spec.date === 'desc' ? columnData.sort(function (a, b) { return new Date(b) - new Date(a); })
														  : columnData.sort(function (a, b) { return new Date(a) - new Date(b); });
				}
			}
		};
		
		return {
			ready: function () {
				var doc = document,
					stdIn = doc.getElementById('stdin'),
					stdOut = doc.getElementById('stdout'),
					preLoader = doc.getElementById('preloader'),
					appCnt = doc.getElementById('app_cnt');
					
				stdOut.addEventListener('click', function (e) {
					(e || window.e).stopPropagation();
					builder.createTable.call(builder, stdIn, doc, preLoader, appCnt);
				}, false);
			}
		};
	}());

document.addEventListener('DOMContentLoaded', app.ready, false);