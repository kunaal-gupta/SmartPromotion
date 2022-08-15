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
        const UserAchievCount = await App.hiring.AchievId()

      // Render out each task with a new task template
        for (let i = 1; i <= UserAchievCount; i++) {
            // Fetch the task data from the blockchain
            const Achievement = await App.hiring.Achievements(i)
            const achName = Achievement[0]
            const ProjName = Achievement[1]
            const achValue = Achievement[2]
            const ProjAllocatedTime = Achievement[3]
            const ProjCompTime = Achievement[4]

            console.log(achName, ProjName, achValue, ProjAllocatedTime, ProjCompTime)

        $(document).ready(function(){
            $("#ShowUserAchievdata").click(function(){
                console.log(achName, ProjName, achValue, ProjAllocatedTime, ProjCompTime)
                $("#Achievtable").append("<tr>" + ' ' + '<td>' + achName + ' ' + '<td>' + ProjName + ' ' + '<td>' + achValue + ' ' + '<td>' + ProjAllocatedTime + ' ' + '<td>'+ ProjCompTime + "</tr>");
                document.getElementById("ShowUserAchievdata").disabled = true;
                document.getElementById("HideUserAchievdata").disabled = false;
            });
        });

        $(document).ready(function(){
            $("#HideUserAchievdata").click(function(){
                console.log("Hiding data")
                $("td").hide()
                document.getElementById("ShowUserAchievdata").disabled = false;
                document.getElementById("HideUserAchievdata").disabled = true;
            });
        });
      }
    },

    renderUsers: async () => {
        const UserCount = await App.hiring.UserId()

      // Render out each task with a new task template
        for (let i = 1; i <= UserCount; i++) {
            // Fetch the task data from the blockchain
            const User = await App.hiring.Users(i)
            const Name = User[0]
            const Title = User[1]
            const Salary = User[2]
            // console.log(Id, Name, Title, Salary)

        $(document).ready(function(){
            $("#ShowUserdata").click(function(){
                console.log(Name, Title, Salary)
                $("#Usertable").append("<tr>" + ' ' + '<td>' + Name + ' ' + '<td>' + Title + ' ' + '<td>' + Salary + "</tr>");
                document.getElementById("ShowUserdata").disabled = true;
                document.getElementById("HideUserdata").disabled = false;
            });
        });

        $(document).ready(function(){
            $("#HideUserdata").click(function(){
                console.log("Hiding data")
                $("td").hide()
                document.getElementById("ShowUserdata").disabled = false;
                document.getElementById("HideUserdata").disabled = true;
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

        let achName = $('#achName').val();
        let ProjName = $('#ProjName').val();
        let achValue = $('#achValue').val();
        let ProjAllocatedTime = $('#ProjAllocatedTime').val();
        let ProjCompTime = $('#ProjCompTime').val();

        await App.hiring.CreateUserAchiev(achName,ProjName, achValue, ProjAllocatedTime, ProjCompTime, {from: account});
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
  