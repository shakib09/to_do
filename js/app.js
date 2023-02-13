
      class Task {
        constructor(title, task_description, reminder_time, done, trashed){
          this.title = title;
          this.description = task_description;
          this.reminder_time = reminder_time;
          this.done = done;
          this.trashed = trashed;
        }
      }

      class TaskManager {
        constructor(){
          this.tasks = [];
          this.container = null; // html container
          this.element = null;   // function to call
        }
        add_task(task){
          this.tasks.push(task);
        }
      }
      let tasks = [];
      let total_tasks = 0;

      function build_task_object(task_title, task_description, task_time){

        let task_object = {
          'id': "task_"+(total_tasks+1),
          'title': task_title,
          'description': task_description,
          'time': task_time,
          'checked': false
        };
        total_tasks += 1;
        return task_object;
      }

      function add_task(task_title, task_description, task_time){
        let task_object = build_task_object(task_title, task_description, task_time);
        tasks.push(task_object);
        return task_object;
      }

      function search_task(task_id){
        return tasks.find((task_object)=>{return task_object.id==task_id;});
      }

      function delete_task_with_id(task_id){
        tasks = tasks.filter((task_object)=>{
          return task_object.id != task_id;  
        });
      }

      function task_element(task_object){
        return `<div class="card shadow bg-white rounded" id="${task_object.id}" style="margin-top: 16px;">
            <div class="card-header" id="title_${task_object.id}">${task_object.title}</div>
            <div class="card-body">
              <p id="time_${task_object.id}">${task_object.time}</p>
              <p id="description_${task_object.id}">${task_object.description}</p>
            </div>
            <div class="card-footer">
              <button type="button" id="edit_${task_object.id}" class="btn btn-primary" data-toggle="modal" data-target="#edit_modal">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button id="delete_${task_object.id}" class="btn btn-danger"><i class="fa-sharp fa-solid fa-trash"></i></button>
            </div>
        </div>`;

      }
      function new_task(){
        console.log("new task");
        let task_title = $("#task_title").val();
        let task_description = $("#task_description").val();
        let task_time = $("#task_time").val();

        let task_object = add_task(task_title, task_description, task_time);
        console.log("new task: ", task_object);

        $("#tasks_list").append(task_element(task_object));
        $(`#delete_${task_object.id}`).on('click', ()=>{
          console.log("remove task");
          remove_task(task_object.id);
        });
        $(`#edit_${task_object.id}`).on('click', ()=>{
          $("#edit_task_title").val(task_object.title);
          $("#edit_task_description").val(task_object.description);
          $("#edit_task_time").val(task_object.time);
          document.getElementById("save_task").onclick = ()=>{update_task(task_object.id)};
        });
      }
      function update_task(task_id){
        console.log("update task");
        let task_title = $("#edit_task_title").val();
        let task_description = $("#edit_task_description").val();
        let task_time = $("#edit_task_time").val();

        let task_object = search_task(task_id);
        console.log("update task: (before)", task_object);

        task_object.title = task_title;
        task_object.description = task_description;
        task_object.time = task_time;

        console.log("update task: (after)", task_object);

        $(`#title_${task_id}`).text(task_title);
        $(`#time_${task_id}`).text(task_time);
        $(`#description_${task_id}`).text(task_description);
      }

      function remove_task(task_id){
        delete_task_with_id(task_id);
        $(`#${task_id}`).remove();
      }

      function taskToast(task){
        return `<div tabindex="0" id="toast_${task.id}" class="toast mt-4 ms-4" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="false" style="width: 300px;!importent">
            <div class="toast-header">
                <strong class="me-auto">${task.title}</strong>
                <small class="text-muted">${task.time}</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast">
                
                </button>
            </div>
            <div class="toast-body">
                <p id="description">${task.description}</p>
            </div>
            </div>
        </div>`;

      }
      function reminderRunner(){
        let ct = new Date();
        console.log("running reminder...", ct);
        
        
        for(task in tasks){
          task = tasks[task];
          let tt = new Date(task.time);
          console.log("task: "+task+" tt: "+tt);
          if(tt<=ct && task.checked==false){
            console.log("reminder for task: ", task, taskToast(task));
            $("#toast_container").append(taskToast(task));
            $(`#toast_${task.id}`).toast("show");
            task.checked = true;
          }
        }
      }

      $("#new_task").on('click', ()=>{console.log("clicked"); new_task();});
      // $(".toast").toast("show");
      setInterval(() => {
        reminderRunner();
      }, 10000);