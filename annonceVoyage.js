$(document).ready(function(){
    $(".contactMenu").on("click", function(){
        $(".loginPage").css("display", "block");
        setTimeout(()=>{
            $('.loginPage').css("transform", "scale(1)" )
          }, 50);

          $(".registerPage").css("display", "none"); 
          $(".AproposBloc").css("display", "none"); 
          $(".findTravelHomePageContent").css("display", "none"); 
        
    })

    // Gestion du bouton suivant de la rubrique information sur le départ

    $("#btnNextInformationSurLeDepart").on("click", function(event){
        event.preventDefault();
        
        $(".informationSurLarrivee").css("display", "block"); 
        $(".InformationSurLeDepart").css("display", "none");
        $(".InformationSurLesPassagers").css("display", "none"); 
        $(".informationsSurLeConducteur").css("display", "none"); 
        $("..DescriptionDuVéhicule").css("display", "none");
    })

    // Gestion du bouton suivant de la rubrique information sur l'arrivée

    $("#btnNextInformationSurLarrivee").on("click", function(event){
        event.preventDefault();
        $(".informationSurLarrivee").css("display", "none"); 
        $(".InformationSurLeDepart").css("display", "none");
        $(".InformationSurLesPassagers").css("display", "block"); 
        $(".informationsSurLeConducteur").css("display", "none"); 
        $(".DescriptionDuVéhicule").css("display", "none");
    })

     // Gestion du bouton suivant de la rubrique information sur les passagers

     $("#btnNextInformationSurLesPassagers").on("click", function(event){
        event.preventDefault();
        $(".informationSurLarrivee").css("display", "none"); 
        $(".InformationSurLeDepart").css("display", "none");
        $(".InformationSurLesPassagers").css("display", "none"); 
        $(".informationsSurLeConducteur").css("display", "block"); 
        $(".DescriptionDuVéhicule").css("display", "none");
    })

    // Gestion du bouton suivant de la rubrique information sur le conducteur

    $("#btnNextInformationSurLeConducteur").on("click", function(event){
        event.preventDefault();
        $(".informationSurLarrivee").css("display", "none"); 
        $(".InformationSurLeDepart").css("display", "none");
        $(".InformationSurLesPassagers").css("display", "none"); 
        $(".informationsSurLeConducteur").css("display", "none"); 
        $(".DescriptionDuVéhicule").css("display", "block");
    })

    $(".btnAnnonceVoyage").on("click", function(event){
        event.preventDefault();
        $(".trouverUnVoyageContent").css("display", "none"); 
        $(".announceTravelFormHomePage").css("display", "block");

    })

    $(".btnTrouveVoyage").on("click", function(event){
        event.preventDefault();
        $(".trouverUnVoyageContent").css("display", "block"); 
        $(".announceTravelFormHomePage").css("display", "none");
        
    })

    $(".FindAtrip").on("click", function(event){
        event.preventDefault();
        $(".announceTravelForm").css("display","none"); 
        $(".loginPage").css("display", "none"); 
        $(".registerPage").css("display", "none");
        $(".listeDesVoyagesContainer").css("display", "none"); 
        $(".listeDesVoyagesBooker").css("display", "none");
        $(".FindTraveilForm").css("display", "block"); 
        $(".resultTotalVoyageListPublieContainer").css("display", "none"); 
         
    })
    $(".announceAtripLogged").click(function(){
        $(".announceTravelForm").css("display","block");
    })

    $(".covoiturageAnnoncé").on("click", function(event){
        event.preventDefault();
        $(".listeDesVoyagesContainer").css({
            "display": "grid",
            "grid-template-columns": "repeat(3, 1fr)",  // 4 colonnes égales
            "gap": "10px"  // espace entre les éléments
        });
        $(".listeDesVoyagesBooker").css("display", "none");
        $(".FindTraveilForm").css("display", "none"); 
        $(".announceTravelForm").css("display","none"); 
        $(".resultTotalVoyageListPublieContainer").css("display", "none"); 
    });


    $(".covoiturageReserve").on("click", function(event){
        event.preventDefault();
        $(".listeDesVoyagesBooker").css({
            "display": "grid",
            "grid-template-columns": "repeat(3, 1fr)",  // 4 colonnes égales
            "gap": "10px"  // espace entre les éléments
        });
        $(".listeDesVoyagesContainer").css("display", "none"); 
        $(".FindTraveilForm").css("display", "none"); 
        $(".announceTravelForm").css("display","none"); 
        $(".resultTotalVoyageListPublieContainer").css("display", "none"); 
    });

    $(".covoiturageFait").on("click", function(event){
        event.preventDefault();
            $(".resultTotalVoyageListPublieContainer").css({
                "display": "grid", 
                "grid-template-columns": "repeat(3, 1fr)",  // 4 colonnes égales
                "gap": "10px"  // espace entre les éléments
            });
            $(".listeDesVoyagesContainer").css("display", "none"); 
            $(".FindTraveilForm").css("display", "none"); 
            $(".announceTravelForm").css("display","none"); 
    })


    
    $(".announceAtrip").click(function(){
        $(".FindTraveilForm").css("display", "none");
        $(".loginPage").css("display", "none"); 
        $(".registerPage").css("display", "none");
        $(".aucunVoyageTrouver").css("display", "none"); 
        $(".listeDesVoyagesBooker").css("display", "none");
        $(".listeDesVoyagesContainer").css("display", "none"); 
        $(".resultTotalVoyageListPublieContainer").css("display", "none"); 
        $(".announceTravelForm").css("display","block"); 
      
        const loginClass = $(".loginBtn");
        if(loginClass){
            console.log("login button already exist"); 
        }else{
            $('.navbar').append('<li><a href="#" class="loginClass" >Login</a></li>'); 
        }
    })

   /* $(".home").click(function(){
        $(".loginPage").css("display", "block");
        $(".announceTravelForm").css("display","none"); 
        $(".FindTraveilForm").css("display", "none"); 
        $(".registerPage").css("display", "none");
    })*/

    $(".loginRedirection").click(function(){
        $(".loginPage").css("display", "block"); 
        setTimeout(()=>{
            $('.loginPage').css("transform", "scale(1)" )
          }, 50);
        $(".registerPage").css("display", "none");
        $(".FindTraveilForm").css("display", "none");
        $(".loginPageFail").css("display", "none");
    })

    $(".registerRedirection").click(function(){
        $(".loginPage").css("display", "none"); 
        $(".registerPage").css("display", "block");
        setTimeout(()=>{
            $('.registerPage').css("transform", "scale(1)" )
          }, 50);
    })

    $(".PriceAndPlacesResult").mouseover(function(){
        $(".popup").css("display", "block"); 
    })
    $(".PriceAndPlacesResult").mouseleave(function(){
        $(".popup").css("display", "none"); 
    })

    $(".booking").mouseover(function(){
        $(".popupBooking").css("display", "block"); 
    })
    $(".booking").mouseleave(function(){
        $(".popupBooking").css("display", "none"); 
    })
}); 
