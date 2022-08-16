App = {

    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
        accounts = await web3.eth.getAccounts();
        account = accounts[0];
        console.log(account);
    },

  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const hiring = await $.getJSON('Hiring.json')
      App.contracts.Hiring = TruffleContract(hiring)
      App.contracts.Hiring.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.hiring = await App.contracts.Hiring.deployed()
    },
  
    render: async () => {
      // Prevent double render

      if (App.loading) {
        return
      }
      App.setLoading(true)
        const accounts = await web3.eth.getAccounts()
      $('#account').html(accounts[0])
        await App.renderUsers()
        await App.renderUsersAchiev()

      App.setLoading(false)
    },
  
    renderUsersAchiev: async () => {

        $(document).ready(function(){
            $("#ShowUserAchievdata").click(function(){
                console.log("Showing data")
                $("#Achievtable").show()
                document.getElementById("ShowUserAchievdata").disabled = true;
                document.getElementById("HideUserAchievdata").disabled = false;
            });
        });

        $(document).ready(function(){
            $("#HideUserAchievdata").click(function(){
                console.log("Hiding data")
                $("#Achievtable").hide()
                document.getElementById("ShowUserAchievdata").disabled = false;
                document.getElementById("HideUserAchievdata").disabled = true;
            });
        });
        const UserAchievCount = await App.hiring.AchievId()

      // Render out each task with a new task template
        for (let i = 0; i < UserAchievCount; i++) {
            // Fetch the task data from the blockchain
            const Achievement = await App.hiring.Achievements(i)

            const UserId = parseInt(Achievement[0])
            const achName = Achievement[1]
            const ProjName = Achievement[2]
            const achValue = parseInt(Achievement[3])
            const ProjAllocatedTime = parseInt(Achievement[4])
            const ProjCompTime = parseInt(Achievement[5])

            const Users = await App.hiring.Users(UserId)
            const UserName = Users[0]

            $(document).ready(function(){
                $("#FetchUserAchievdata").click(function(){
                    console.log(achName, ProjName, achValue, ProjAllocatedTime, ProjCompTime)
                    $("#Achievtable").append("<tr id = 'Userdata'>" + ' ' + '<td>' + UserName + ' ' + '<td>' + achName + ' ' + '<td>' + ProjName + ' ' + '<td>' + achValue + ' ' + '<td>' + ProjAllocatedTime + ' ' + '<td>'+ ProjCompTime + "</tr>");
                    document.getElementById("FetchUserAchievdata").disabled = true;
                    document.getElementById("HideUserAchievdata").disabled = false;

                });
            });
      }
    },

    renderUsers: async () => {


        $(document).ready(function(){
            $("#ShowUserdata").click(function(){
                console.log("Showing data")
                $("#Usertable").show()
                document.getElementById("ShowUserdata").disabled = true;
                document.getElementById("HideUserdata").disabled = false;
            });
        });

        $(document).ready(function(){
            $("#HideUserdata").click(function(){
                console.log("Hiding data")
                $("#Usertable").hide()
                document.getElementById("ShowUserdata").disabled = false;
                document.getElementById("HideUserdata").disabled = true;
            });
        });

        const UserCount = await App.hiring.UserId()

      // Render out each task with a new task template
        for (let i = 0; i < UserCount; i++) {
            // Fetch the task data from the blockchain
            const User = await App.hiring.Users(i)
            const Id = parseInt(i)
            const Name = User[0]
            const Title = User[1]
            const Salary = parseInt(User[2])



            $(document).ready(function(){
                $("#FetchUserdata").click(function(){
                    $("#Usertable").show()
                    $("#Usertable").append("<tr>" + ' ' + '<td>' + Id + " " + "<td>" + Name + ' ' + '<td>' + Title + ' ' + '<td>' + Salary + "</tr>");
                    console.log('Fetching data')

                    document.getElementById("FetchUserdata").disabled = true;
                    document.getElementById("HideUserdata").disabled = false;

                });
            });


      }
    },


    createUser: async function () {
        App.setLoading(true);

        let name = $('#Name').val();
        let title = $('#Title').val();
        let salary = $('#Salary').val();

        await App.hiring.createUser(name, title, salary, {from: account});
        window.location.reload()
    },

    createUserAchiev: async function () {
        App.setLoading(true);

        let EmployeeId = $('#EmployeeId').val();
        let achName = $('#achName').val();
        let ProjName = $('#ProjName').val();
        let achValue = $('#achValue').val();
        let ProjAllocatedTime = $('#ProjAllocatedTime').val();
        let ProjCompTime = $('#ProjCompTime').val();

        await App.hiring.CreateUserAchiev(EmployeeId, achName,ProjName, achValue, ProjAllocatedTime, ProjCompTime, {from: account});
        window.location.reload()
    },
  
    // toggleCompleted: async (e) => {
    //   App.setLoading(true)
    //   const taskId = e.target.name
    //   await App.todoList.toggleCompleted(taskId)
    //   window.location.reload()
    // },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
}


$(() => {
    $(window).load(() => {
        App.load()
    })
})
  