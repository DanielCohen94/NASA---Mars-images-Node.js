'use strict';
import {validation} from './validation.js';

/**
 * Module that mange connect to nasa
 * @type {{}}
 */
let nasaConnection = (() => {

    const APIKEY = "1z33auQd8WbWxclCZ2zn79M0cTszssCxcDEFVoKL";
    let connection_public = {};
    /**
     * get mission settings
     * @param mission_name
     * @returns {Promise<{data: *, status: boolean}|{data: string, status: boolean}>}
     */
    connection_public.initMission = async (mission_name) => {
        const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${mission_name}?api_key=${APIKEY}`;
        return handler_connection_fetch(url);
    }
    /**
     * get photos by the date, mission and camera
     * @param date
     * @param mission
     * @param camera
     * @returns {Promise<*|*[]>}
     */
    connection_public.getPhotos = async (date, mission, camera) => {
        const format = validation.isEarthDate(date) ? 'earth_date' : 'sol';
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${mission}/photos?${format}=${date}&camera=${camera}&api_key=${APIKEY}`;
        return handler_connection_fetch(url);
    }
    /**
     * display error in case of connection problem
     */
    connection_public.displayConnectError = () => {
        document.getElementById('del-err').innerHTML =
            `<div style="background-color: rgba(255, 0, 0, 0.6)">
                        <h5>connection problem, please try again later..</h5>
                        </div>`;
    }
    /**
     * check if get status between 200-300
     * @param response
     * @returns {Promise<never>|Promise<unknown>}
     */
    const status = (response) => {
        if (response.status >= 200 && response.status < 300)
            return Promise.resolve(response);
        else
            return Promise.reject(new Error(response.statusText));
    }
    /**
     *
     * @param url
     * @returns {Promise<{data: *, status: boolean}|{data: string, status: boolean}>}
     */
    const handler_connection_fetch = async (url) => {
        return await connection_fetch(url).then(response => {
            return Promise.resolve(response);
        }).catch(err => {
            return Promise.reject(err);
        });
    }
    /**
     * finction that make a fetch according to url
     * @param url
     * @returns {Promise<{data: *, status: boolean} | {data: string, status: boolean}>}
     */
    const connection_fetch = (url) => {
        return fetch(url)
            .then(status)
            .then(res => res.json())
            .then(json => {
                return {status: true, data: json};
            })
            .catch((err) => {
                return {status: false, data: err};
            });
    }

    return connection_public;
})();

/**
 * This module in charge of missions data
 * @type {{}}
 */
const missions = (function () {

    let public_data = {};
    let list = [];

    const missions_list = ['Curiosity', 'Opportunity', 'Spirit'];
    /**
     * Init Mission - for every mission in the missions_list
     */
    public_data.initMissions = () => {
        for (let mission of missions_list) {
            nasaConnection.initMission(mission)
                .then(response => {
                    if (response.status) {
                        add(response.data.photo_manifest);
                    } else
                        nasaConnection.displayConnectError();
                })
                .catch(() => {
                    return false;
                });
        }
    }

    /**
     * add new mission
     * @type {public_data.add}
     */
    const add = (mission) => {
        const element = new Mission(mission.name, mission.landing_date, mission.max_date, mission.max_sol);
        list.push(element);
    }

    /**
     * find the mission and send the data to the valid range function
     * @type {function(*, *=): {isValid: boolean, message: string}}
     */
    public_data.validDateWithMission = ((mission_name, date) => {
        const element = list.find(mission => mission.mission_name === mission_name);
        return (validation.isEarthDate(date)) ?
            validation.validRange(date, element.landing_date, element.max_date) :
            validation.validRange(date, 0, element.max_sol)
    })

    /**
     * create new mission
     * @type {Mission}
     */
    class Mission {
        constructor(name, landing_date, max_date, sol) {
            this.mission_name = name;
            this.landing_date = landing_date;
            this.max_date = max_date;
            this.max_sol = sol;
        }
    }

    return public_data;
})();

/**
 * This module in charge of saved images
 * @type {{}}
 */
const savedImg = (() => {

    let public_data = {};

    public_data.getAllImg = (() => {
        document.getElementById("spinner").style.display = "block";

        getAll()
        .then(res => res.json()).then(json => {
            document.getElementById("spinner").style.display = "none";
            displaySave(json.answer);
        });
    })

    /**
     * Doing fetch gets all the pictures and returns a promise for further treatment
     * @returns {Promise<Response>}
     */
    const getAll = () => {
        return fetch("api/gatAll", {
            method: "POST",
            headers: {"Content-Type": "application/json"}
        })
    }
    /**
     * Adds a new image
     * @type {public_data.addSavedImg}
     */
    public_data.addSavedImg = ((item) => {
        document.getElementById("spinner").style.display = "block";
        fetch("api/addImg", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({element: item})
        }).then(res => res.json()).then(json => {
            document.getElementById("spinner").style.display = "none";
            if (json.status) {
                displaySave(json.answer);
            } else {
                document.getElementById("Modal").style.display = ("block");
            }
        }).catch(() => { window.location.pathname = "/"});
    })

    /**
     * display all Saved images
     * @param data
     */
    const displaySave = (data) => {
        document.getElementById("SavedList").innerHTML = ""
        for (let i = 0; i < data.length; i++)
            document.getElementById("SavedList").appendChild(buildHTMLNodeSaved(data[i], i));
    }

    /**
     * Display carrousel
     */
    public_data.displayCarrousel = () => {
        getAll()
        .then(res => res.json()).then(json => {
            if (json.answer.length) {
                public_data.deleteCarrousel();
                document.getElementById("Carrousel").style.display = "block"
                for (let i = 0; i < json.answer.length; i++) {
                    buildHTMLNodeSavedCarrousel(json.answer[i], i);
                }
            }
        });
    }

    /**
     * Delete Carrousel element
     */
    public_data.deleteCarrousel = () => {
        document.getElementById("CarouselInner").innerHTML = "";
        document.getElementById("Carrousel").style.display = "none"
    }

    /**
     * build html node from saved images element
     * @param item - to make an html node from him
     * @param index - the numbers on the side
     * @returns {HTMLDivElement}
     */
    const buildHTMLNodeSaved = (item, index) => {
        const element = document.createElement('div');
        element.setAttribute('class', 'col-sm-8');

        element.innerHTML = `
        <div class="row" >
        <p>${++index}.
        <a href="${item.url}"role="button" target="_blank" aria-pressed="true">image id:${item.id_img}</a> 
        <br>Earth date:${item.earth_date}, Sol:${item.sol}, Camera:${item.camera}
        <button type="button" class="btn btn-danger" id="${item.id_img}">delete</button>
        </p>
        </div>`;
        // add Event Listener to delete specific image
        element.querySelector('.btn-danger').addEventListener('click', () => {
            document.getElementById("spinner").style.display = "block";

            fetch("api/deleteItem", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({element: item})
            }).then(res => res.json()).then(json => {
                document.getElementById("spinner").style.display = "none";

                displaySave(json.answer);
            }).catch(() => { window.location.pathname = "/"});

        });
        return element;
    }

    /**
     * build html Carrousel node from saved images element
     * @param item -to make an html node from him
     * @param index -In the first case we will need to add active
     */
    const buildHTMLNodeSavedCarrousel = (item, index) => {

        let name = index ? 'carousel-item' : 'carousel-item active';
        document.getElementById("CarouselInner").innerHTML += `
            <div class="${name}" data-bs-interval="2000">
                <img src=${item.url} class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${item.mission}</h5>
                    <p>${item.earth_date}</p>
                    <a href="${item.url}" class="btn btn-primary" role="button" target="_blank" aria-pressed="true">Full Size</a>
                </div>
            </div>`;
    }

    return public_data;
})();

/**
 * This module in charge of result search
 * @type {{}}
 */
const resultImg = (() => {

    let public_data = {};

    let searchRes = [];

    class img {
        constructor(earth_date, sol, camera, mission, id_img, url) {
            this.earth_date = earth_date;
            this.sol = sol;
            this.camera = camera;
            this.mission = mission;
            this.id_img = id_img;
            this.url = url;
        }
    }

    /**
     * add new search result
     * @type {public_data.addSearchRes}
     */
    public_data.addSearchRes = ((item) => {
        const element = new img(item.earth_date, item.sol, item.camera.name, item.rover.name, item.id, item.img_src);
        searchRes.push(element);

    })

    /**
     * Display Result list
     */
    public_data.displayRes = () => {
        let element = document.getElementById("SearchResultList");
        element.innerHTML = "";
        if (searchRes.length)
            for (let i = 0; i < searchRes.length; i++) {
                element.appendChild(buildHTMLNodeRes(searchRes[i]));
            }
        else
            element.appendChild(buildHTMLNodeResEmpty());
    }

    /**
     * build HTML Node in case of empty list
     * @returns {HTMLDivElement}
     */
    const buildHTMLNodeResEmpty = () => {
        const element = document.createElement('div');
        element.setAttribute('class', 'col-sm-4');

        element.innerHTML = `
            <h5>No images found!</h5>
        `;
        return element;
    }

    /**
     * Build html node to result item
     * @param item - to make from him an html
     * @returns {HTMLDivElement}
     */
    const buildHTMLNodeRes = (item) => {
        const element = document.createElement('div');
        element.setAttribute('class', 'col-sm-4');

        element.innerHTML = `
        <div class="card" style="width: 18rem;">
                    <img src=${item.url} class="card-img-top" alt="...">
                    <div class="card-body">
                    <p class="card-text" style="color:black">Earth date:${item.earth_date}</p>
                    <p class="card-text" style="color:black">Sol:${item.sol}</p>
                    <p class="card-text" style="color:black">Camera${item.camera}</p>
                    <p class="card-text" style="color:black">Mission${item.mission}</p>
                    <a href="${item.url}" class="btn btn-primary" role="button" target="_blank" aria-pressed="true">Full Size</a>
                    <button type="button" class="btn btn-danger" id="${item.id}">save</button>
                    </div>
        </div>`;
        // Add Listener to current HTMLNode save button
        element.querySelector('.btn-danger').addEventListener('click', () => {
            savedImg.addSavedImg(item)
        });
        return element;
    }

    /**
     * clear all result list
     * @constructor
     */
    public_data.ClearResList = () => {
        searchRes = [];
        document.getElementById("SearchResultList").innerHTML = ""
    }

    return public_data;
})();

/**
 * Adding listeners after building the DOM
 * and auxiliary functions
 */
(function () {
    /**
     * this function validate all field of form
     * @param theDateElem
     * @param theRoverElem
     * @param theCameraElem
     * @returns {*}
     */
    const validateForm = (theDateElem, theRoverElem, theCameraElem) => {

        theDateElem.value = theDateElem.value.trim();

        // display all errors, force checking all fields
        let v1 = validation.validateInput(theDateElem, validation.isNotEmpty);
        let v2 = validation.validateInput(theRoverElem, validation.isNotEmpty);
        let v3 = validation.validateInput(theCameraElem, validation.isNotEmpty);

        let v = v1 && v2 && v3;
        if (v1) {
            let data = validation.validateInput(theDateElem, validation.formatDate);
            v = v && data;
            if (data) {
                let range = validation.validateInputDouble(theRoverElem, theDateElem, missions.validDateWithMission);
                v = v && data && range;
            }
        }
        return v;
    }
    /**
     * clear element
     * @param item - to clear
     */
    const clearElement = (item) => {
        item.value = '';
        item.nextElementSibling.innerHTML = '';
        item.classList.remove('is-invalid');
    }

    /**
     *  Add Listener for every button after DOM Content Loaded
     */
    window.addEventListener('DOMContentLoaded', () => {
        document.getElementById("spinner").style.display = "block";
        missions.initMissions();
        document.getElementById("spinner").style.display = "none";

        savedImg.getAllImg();

        const dateInput = document.getElementById("date");
        const roverInput = document.getElementById("rover");
        const cameraInput = document.getElementById("camera");
        /**
         * add Listener to search button
         */
        document.getElementById("search").addEventListener('click', (event) => {
            event.preventDefault();
            if (validateForm(dateInput, roverInput, cameraInput)) {
                document.getElementById("spinner").style.display = "block";
                nasaConnection.getPhotos(dateInput.value, roverInput.value, cameraInput.value)
                    .then(response => {
                        if (response.status) {
                            resultImg.ClearResList();
                            let photos_list = response.data.photos;
                            for (let i = 0; i < photos_list.length; i++) {
                                resultImg.addSearchRes(photos_list[i]);
                            }
                            resultImg.displayRes();
                            document.getElementById("spinner").style.display = "none";
                        } else
                            nasaConnection.displayConnectError();
                    })
                    .catch(() => { window.location.pathname = "/"});
            }
        });
        /**
         * add Listener to clear button
         */
        document.getElementById("clear").addEventListener('click', () => {
            clearElement(document.getElementById("date"));
            clearElement(document.getElementById("rover"));
            clearElement(document.getElementById("camera"));

            resultImg.ClearResList();
        });
        /**
         * add Listener to start slide button
         */
        document.getElementById("start-slide").addEventListener('click', () => {
            savedImg.displayCarrousel();
        });
        /**
         * add Listener to stop slide button
         */
        document.getElementById("stop-slide").addEventListener('click', () => {
            savedImg.deleteCarrousel();
        });

        document.getElementById("ClearList").addEventListener('click', () => {
            document.getElementById("spinner").style.display = "block";

            fetch("api/deleteAll", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            }).then(res => res.json()).then(() => {
                document.getElementById("spinner").style.display = "none";

                document.getElementById("SavedList").innerHTML = "";
            }).catch(() => { window.location.pathname = "/"});
        });

        document.getElementById("logout").addEventListener('click', () => {
            window.location.pathname = "logOut";
        });

        /**
         * add Listener to close all modals
         * @type {HTMLCollectionOf<Element>}
         */
        let x = document.getElementsByClassName("close-modal");
        for (let i = 0; i < x.length; i++) {
            x[i].addEventListener('click', () => {
                document.getElementById("Modal").style.display = ("none");
            });
        }

    });
})();