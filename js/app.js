var parse = function(quote) {
    var arr = new Array();
    for (var i = 0; i < quote.length; ++i) {
        var o = new Object();
        var c = quote.charAt(i);
        o.index = i;
        o.original = c;
        o.letter = c;
        o.special = true;
        o.dirty = true;
        if (quote.charCodeAt(i) >= 65 && quote.charCodeAt(i) <= 90) {
            o.special = false;
            o.dirty = false;
        }
        arr.push(o);
    }
    return arr;
};

var app = angular.module('myApp',[]);

app.controller('dbGet', 
    function($scope, $http) {

        $scope.loadQuiz = function() {
            $http.get("crypto.php")
                .then(function(response) {
                    $scope.status = response.data.status;
                    if ($scope.status !== 'ok') {
                        $scope.error = true;
                    } else {
                        $scope.error = false;
                        $scope.id = response.data.id;
                        $scope.quote = response.data.quote;
                        $scope.source = response.data.source;
                        $scope.year = response.data.year;
                        $scope.letters = parse(response.data.quiz);
                    }
                }, function(response) {
                    $scope.error = true;
                });
        }

        $scope.firstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
        $scope.secondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
        $scope.thirdRow = ["Z", "X", "C", "V", "B", "N", "M"];
        $scope.statMsg = "Crack the code to find the movie quote.";
        $scope.statClass = "w3-panel w3-sand w3-xxlarge w3-serif";
        $scope.keyboardOn = false;
        $scope.openCheat = false;
        
        $scope.cheatMode = function() {
            if ($scope.openCheat == false) {
                return "w3-container w3-hide";
            } else {
                return "w3-container w3-show";
            }
        };

        var active=false;
        var current="";
        var hover="";

        $scope.keyboardClick = function($event) {
            if (current == "") {
                return;
            }
            var key = $event.target.innerText;
            var allDirty = true;
            var solved = true;
            for (var i = 0; i < $scope.letters.length; ++i) {
                var l = $scope.letters[i];
                
                if (l.original == current) {
                    l.dirty = true;
                    l.letter = key;
                } 
                if (l.dirty == false) {
                    console.log(l.index + ", " + l.letter + " is dirty");
                    allDirty = false;
                } 
                if (l.letter != $scope.quote[i]) {
                    solved = false;
                }
            }
            current = "";
            if (solved) {
                $scope.statMsg = "You solved it!!!";
                $scope.statClass = "w3-panel w3-green w3-xxlarge w3-serif";
            } else if (allDirty) { 
                $scope.statMsg = "This is not the correct answer. Keep trying.";
                $scope.statClass = "w3-panel w3-red w3-xxlarge w3-serif";
            }
        }

        $scope.outHandler = function(l) {
            active=false;
        }

        $scope.clickHandler = function(l) {
            if(l.special) {
                return;
            }
            active = true;
            current = l.original;
            hover = "";
        }

        $scope.hoverHandler = function(l) {
            active = true;
            hover = l.original;
        }
        
        $scope.keyboardActive = function() {
            if (current != "") {
                return "w3-button w3-teal w3-xlarge w3-border w3-border-black";
            } else {
                return "w3-button w3-teal w3-xlarge w3-border w3-border-black w3-disabled";

            }
        }

        $scope.findClass = function(l) {
           var noAlpha = "w3-btn w3-white w3-disabled w3-xlarge w3-border w3-border-white";
           var inactive = "w3-btn w3-black w3-xlarge w3-border w3-border-white"
           var dirty = "w3-btn w3-white w3-xlarge w3-border w3-border-black"
           var onHover = "w3-btn w3-grey  w3-xlarge w3-border w3-border-white"
           var onSelect = "w3-btn w3-teal w3-xlarge w3-border w3-border-white"
           if (l.special == true) {
                return noAlpha;
            } else if  (l.original == current) {
                return onSelect;
            } else if  (l.original == hover && active == true) {
                return onHover;
            } else if (l.dirty == false) { 
                return inactive;
            } else {
                return dirty;
            }
        };
});
