/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * Created by esyacelga
 */


app.controller('ArticleController',['system_variable','$scope', '$timeout', '$http', 'Alertify', 'blockUI', 'ngTableParams', 
                                    function(system_variable,$scope, $timeout, $http, Alertify, blockUI, ngTableParams) 
{
        controller = this;
        controller.lstArticles;
        controller.variablesFacturacion=system_variable.getInvoiceVariable();
        
        controller.tableParams = new ngTableParams({
            page: 1,            		// show first page
            count: 4,          			// count per page
            sorting: {
                		name: 'asc'     // initial sorting
            		 }
        }, {
            
        	total: 0,           // length of data
            getData: function($defer, params) {

                var paramFilter = {
                    "firstResult": (params.page() - 1) * params.count(),
                    "itemsPerPage": params.count(),
                    "filterByFields": params.filter(),
                    "orderBy": params.sorting()
                };

                blockUI.start();

                var response = $http.post('retrieveArticle_json.json', paramFilter);
                response.success(function (data, status, headers, config) {
                    controller.lstArticles = data;
                    $scope.items = data.items;
                    params.total(data.totalCount);
                    $defer.resolve(data.items);
                    blockUI.stop();
                });

                response.error(function (data, status, headers, config) {
                    Alertify.error('Ocurrio un error al retornar valores!');
                    blockUI.stop();
                });
            }
        });
        controller.initArticle = function(){
            controller.articleObj = undefined;
        }
        controller.newArticle = function(){
            controller.articleObj = {         		 	
            						};
        }
        controller.saveArticle = function(){
            blockUI.start();

            var response = $http.post('createArticle_json.json', controller.articleObj);
            response.success(function (data, status, headers, config) {
                Alertify.success('Registro guardado!');
                blockUI.stop();
                controller.initArticle();
            });

            response.error(function (data, status, headers, config) {
                Alertify.error('Ocurrio un error al guardar!');
                blockUI.stop();
            });
        }

        controller.editArticle = function(currentArticle){
            controller.articleObj = currentArticle;
        }

        controller.cancelArticle = function(){
            controller.initArticle();
        }

        controller.initArticle();

    }]);